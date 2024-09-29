import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import { BASE_URL } from "../common";
import { Pokemon, PokemonFetchResult } from "../types";
const app = new Elysia()
  .use(
    swagger({
      path: "/swagger",
    })
  )
  .get("/", async ({ query }) => {
    const count = Number(query.limit) || 10; // Default limit is 10
    const page = Number(query.page) || 1; // Default page is 1
    const offset = (page - 1) * count;

    const res = await fetch(
      `${BASE_URL}pokemon?limit=${count}&offset=${offset}`
    );

    const result = (await res.json()) as PokemonFetchResult;

    const totalPages = Math.ceil(result.count / count);

    const pokemonMap = result.results.map((p) => p.url);

    const pokemonList: Pokemon[] = await Promise.all(
      pokemonMap.map(async (url) => {
        const res = await fetch(url);
        return res.json();
      })
    );

    const structuredData = pokemonList.map((p) => {
      const filteredSprites = {
        front_default: p.sprites.front_default || undefined,
        front_shiny: p.sprites.front_shiny || undefined,
        other: {
          dream_world: {
            front_default:
              p.sprites.other.dream_world.front_default || undefined,
          },
          home: {
            front_default: p.sprites.other.home.front_default || undefined,
            front_shiny: p.sprites.other.home.front_shiny || undefined,
          },
          showdown: {
            front_default: p.sprites.other.showdown.front_default || undefined,
            front_shiny: p.sprites.other.showdown.front_shiny || undefined,
          },
        },
      };

      // Filter out any keys that are undefined in the sprites
      const filteredSpritesWithoutNull = JSON.parse(
        JSON.stringify(filteredSprites)
      );

      return {
        id: p.id,
        name: p.name,
        weight: p.weight,
        types: p.types.map((t) => t.type.name),
        stats: p.stats.map((s) => ({
          name: s.stat.name,
          base_stat: s.base_stat,
        })),
        sprites: filteredSpritesWithoutNull,
      };
    });

    return {
      count: result.count,
      currentPage: page,
      totalPages,
      results: structuredData,
    };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
