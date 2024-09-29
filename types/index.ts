export type PokemonFetchResult = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

export type Pokemon = {
  id: number;
  name: string;
  weight: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other: {
      dream_world: {
        front_default: string | null;
      };
      home: {
        front_default: string | null;
        front_shiny: string | null;
      };
      showdown: {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
};
