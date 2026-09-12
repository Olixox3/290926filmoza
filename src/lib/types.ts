export type TitleKind = "movie" | "series" | "show";

export type Genre = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
};

export type VideoSource = {
  id: number;
  titleId: number | null;
  episodeId: number | null;
  label: string;
  url: string;
  kind: "mp4" | "hls" | "embed";
  language: string;
  isPrimary: boolean;
};

export type Episode = {
  id: number;
  seasonId: number;
  episodeNumber: number;
  title: string;
  description: string | null;
  runtimeMinutes: number | null;
  stillUrl: string | null;
  sources: VideoSource[];
};

export type Season = {
  id: number;
  titleId: number;
  seasonNumber: number;
  name: string | null;
  episodes: Episode[];
};

export type TitleCard = {
  id: number;
  kind: TitleKind;
  title: string;
  originalTitle: string | null;
  slug: string;
  year: number | null;
  description: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  quality: string | null;
  ageRating: string | null;
  runtimeMinutes: number | null;
  country: string | null;
  director: string | null;
  castText: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  genres: { id: number; name: string; slug: string }[];
  ratingAvg: number | null;
  ratingCount: number;
};

export type TitleDetail = TitleCard & {
  trailerUrl: string | null;
  seasons: Season[];
  sources: VideoSource[];
  similar: TitleCard[];
};

export type WatchProgress = {
  titleId: number;
  episodeId: number | null;
  positionSeconds: number;
  durationSeconds: number;
  updatedAt: string;
  title: TitleCard;
  episodeTitle: string | null;
};

export type Profile = {
  userId: string;
  displayName: string | null;
  role: "user" | "admin";
};

export const KIND_LABEL: Record<TitleKind, string> = {
  movie: "Film",
  series: "Serial",
  show: "Program",
};

export const KIND_PLURAL: Record<TitleKind, string> = {
  movie: "Filmy",
  series: "Seriale",
  show: "Programy",
};
