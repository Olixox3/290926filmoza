create table if not exists profiles (
  user_id      text primary key,
  display_name text,
  role         text not null default 'user',
  created_at   timestamptz not null default now()
);

create table if not exists genres (
  id         serial primary key,
  name       text not null unique,
  slug       text not null unique,
  sort_order int not null default 0
);

create table if not exists titles (
  id               serial primary key,
  kind             text not null,
  title            text not null,
  original_title   text,
  slug             text not null unique,
  year             int,
  description      text,
  poster_url       text,
  backdrop_url     text,
  trailer_url      text,
  quality          text,
  age_rating       text,
  runtime_minutes  int,
  country          text,
  director         text,
  cast_text        text,
  is_featured      boolean not null default false,
  is_published     boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists titles_kind_idx on titles (kind);
create index if not exists titles_featured_idx on titles (is_featured);

create table if not exists title_genres (
  title_id int not null references titles(id) on delete cascade,
  genre_id int not null references genres(id) on delete cascade,
  primary key (title_id, genre_id)
);

create table if not exists seasons (
  id            serial primary key,
  title_id      int not null references titles(id) on delete cascade,
  season_number int not null,
  name          text,
  unique (title_id, season_number)
);

create table if not exists episodes (
  id              serial primary key,
  season_id       int not null references seasons(id) on delete cascade,
  episode_number  int not null,
  title           text not null,
  description     text,
  runtime_minutes int,
  still_url       text,
  unique (season_id, episode_number)
);

create table if not exists video_sources (
  id         serial primary key,
  title_id   int references titles(id) on delete cascade,
  episode_id int references episodes(id) on delete cascade,
  label      text not null default 'Odtwarzacz',
  url        text not null,
  kind       text not null default 'mp4',
  language   text not null default 'pl',
  is_primary boolean not null default true
);

create table if not exists favorites (
  user_id    text not null,
  title_id   int not null references titles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, title_id)
);

create table if not exists watch_progress (
  user_id           text not null,
  title_id          int not null references titles(id) on delete cascade,
  episode_id        int references episodes(id) on delete cascade,
  position_seconds  int not null default 0,
  duration_seconds  int not null default 0,
  updated_at        timestamptz not null default now(),
  unique (user_id, title_id)
);

create table if not exists ratings (
  user_id  text not null,
  title_id int not null references titles(id) on delete cascade,
  score    int not null check (score between 1 and 10),
  primary key (user_id, title_id)
);

insert into genres (id, name, slug, sort_order) values
  (1,  'Akcja',       'akcja',       1),
  (2,  'Animacja',    'animacja',    2),
  (3,  'Dramat',      'dramat',      3),
  (4,  'Fantasy',     'fantasy',     4),
  (5,  'Horror',      'horror',      5),
  (6,  'Komedia',     'komedia',     6),
  (7,  'Sci-Fi',      'sci-fi',      7),
  (8,  'Niemy',       'niemy',       8),
  (9,  'Klasyka',     'klasyka',     9),
  (10, 'Przygodowy',  'przygodowy',  10),
  (11, 'Familijny',   'familijny',   11),
  (12, 'Thriller',    'thriller',    12)
on conflict do nothing;

insert into titles (
  id, kind, title, original_title, slug, year, description,
  poster_url, backdrop_url, quality, age_rating, runtime_minutes,
  country, director, cast_text, is_featured, is_published
) values
  (1, 'movie', 'Big Buck Bunny', 'Big Buck Bunny', 'big-buck-bunny', 2008,
   'Otwarty film Fundacji Blendera. Ogromny, łagodny królik mieszka na łące — aż trójka złośliwych gryzoni psuje mu poranek. Krótka, soczysta zemsta w pełnym słońcu.',
   '/posters/big-buck-bunny.jpg', '/backdrops/big-buck-bunny.jpg',
   'FHD', '7', 10, 'Holandia', 'Sacha Goedegebure', 'Big Buck Bunny, Frank, Rinky, Gimera', true, true),
  (2, 'movie', 'Sintel', 'Sintel', 'sintel', 2010,
   'Dziewczyna imieniem Sintel wędruje przez mroźny świat, by odnaleźć rannego smoka, którego kiedyś uratowała. Epicki, melancholijny open movie Blendera.',
   '/posters/sintel.jpg', '/backdrops/sintel.jpg',
   'FHD', '12', 15, 'Holandia', 'Colin Levy', 'Sintel, Scales', true, true),
  (3, 'movie', 'Tears of Steel', 'Tears of Steel', 'tears-of-steel', 2012,
   'Amsterdam przyszłości. Grupa partyzantów wraca na pole bitwy, by powstrzymać inteligentne maszyny. Połączenie live action i CGI z otwartego projektu Blendera.',
   null, '/backdrops/cinema.jpg',
   'FHD', '12', 12, 'Holandia', 'Ian Hubert', 'Celese, Thom', false, true),
  (4, 'movie', 'Elephants Dream', 'Elephants Dream', 'elephants-dream', 2006,
   'Pierwszy otwarty film Blendera. Emo i Probo błądzą po surrealistycznej machinie ze stali, kabli i dziwnych pomieszczeń — sen, z którego trudno się wybudzić.',
   '/posters/elephants-dream.jpg', '/backdrops/cinema.jpg',
   'HD', '12', 11, 'Holandia', 'Bassam Kurdali', 'Emo, Probo', false, true),
  (5, 'movie', 'Cosmos Laundromat', 'Cosmos Laundromat', 'cosmos-laundromat', 2015,
   'Zrozpaczona owca na bezludnej planecie dostaje od tajemniczego sprzedawcy ofertę, której nie sposób odrzucić. Pierwszy cykl otwartego uniwersum Blendera.',
   '/posters/cosmos-laundromat.jpg', '/backdrops/cinema.jpg',
   'FHD', '7', 12, 'Holandia', 'Mathieu Auvray', 'Franck, Paul', true, true),
  (6, 'movie', 'Noc żywych trupów', 'Night of the Living Dead', 'noc-zywych-trupow', 1968,
   'Grupa nieznajomych zamyka się w farmie, gdy umarli zaczynają chodzić. Klasyczny horror George’a A. Romero — film przeszedł do domeny publicznej w USA.',
   '/posters/night-of-the-living-dead.jpg', '/backdrops/cinema.jpg',
   'SD', '16', 96, 'USA', 'George A. Romero', 'Duane Jones, Judith O''Dea, Karl Hardman', true, true),
  (7, 'movie', 'Nosferatu', 'Nosferatu, eine Symphonie des Grauens', 'nosferatu', 1922,
   'Hutter jedzie w Karpaty, by sprzedać dom tajemniczemu hrabiemu Orlokowi. Ekspresjonistyczny wampiryczny niemowa Murnaua, jeden z filarów horroru.',
   '/posters/nosferatu.jpg', '/backdrops/nosferatu.jpg',
   'HD', '12', 81, 'Niemcy', 'F. W. Murnau', 'Max Schreck, Gustav von Wangenheim, Greta Schröder', true, true),
  (8, 'movie', 'Gabinet doktora Caligari', 'Das Cabinet des Dr. Caligari', 'gabinet-doktora-caligari', 1920,
   'Targowisko, lunatyk i doktor, który każe mu zabijać. Kanoniczny film niemieckiego ekspresjonizmu — krzywe dekoracje, obłęd i pierwsze wielkie twisty kina.',
   null, '/backdrops/cinema.jpg',
   'SD', '12', 76, 'Niemcy', 'Robert Wiene', 'Werner Krauss, Conrad Veidt, Lil Dagover', false, true),
  (9, 'movie', 'Metropolis', 'Metropolis', 'metropolis', 1927,
   'Miasto przyszłości rozdarte między elitą wieżowców a robotnikami pod ziemią. Syn mediatra zakochuje się w Marii i schodzi do podziemi. Wizja Langa, która zdefiniowała science fiction.',
   '/posters/metropolis.jpg', '/backdrops/cinema.jpg',
   'HD', '12', 153, 'Niemcy', 'Fritz Lang', 'Brigitte Helm, Gustav Fröhlich, Rudolf Klein-Rogge', true, true),
  (10, 'movie', 'Generał', 'The General', 'general', 1926,
   'Maszynista Johnnie Gray goni pociąg skradziony przez wroga — i swoją ukochaną. Buster Keaton w jednym z najczystszych komediowych widowisk kina niemego.',
   '/posters/the-general.jpg', '/backdrops/cinema.jpg',
   'HD', '7', 79, 'USA', 'Buster Keaton, Clyde Bruckman', 'Buster Keaton, Marion Mack', false, true),
  (11, 'movie', 'Sherlock Junior', 'Sherlock Jr.', 'sherlock-junior', 1924,
   'Bileter kinowy zasypia w kabinie operatora i wchodzi do filmu, żeby rozwiązać sprawę. Keaton rozbija czwartą ścianę zanim kino wiedziało, że ją ma.',
   null, '/backdrops/cinema.jpg',
   'SD', '7', 45, 'USA', 'Buster Keaton', 'Buster Keaton, Kathryn McGuire', false, true),
  (12, 'movie', 'Plan 9 z kosmosu', 'Plan 9 from Outer Space', 'plan-9-z-kosmosu', 1959,
   'Kosmicianie wskrzeszają zmarłych, żeby powstrzymać Ziemian przed zbudowaniem broni ostatecznej. Kultowy „najgorszy film wszech czasów” Eda Wooda.',
   null, '/backdrops/cinema.jpg',
   'SD', '12', 79, 'USA', 'Edward D. Wood Jr.', 'Gregory Walcott, Maila Nurmi, Béla Lugosi', false, true),
  (13, 'movie', 'Szarada', 'Charade', 'szarada', 1963,
   'Reggie dowiaduje się, że mąż ukradł fortunę, a teraz ścigają ją trzej mężczyźni i czarujący nieznajomy. Hitchcockowska komedia kryminalna z Grantem i Hepburn — w USA w domenie publicznej.',
   null, '/backdrops/cinema.jpg',
   'HD', '12', 113, 'USA', 'Stanley Donen', 'Cary Grant, Audrey Hepburn, Walter Matthau', false, true),
  (14, 'movie', 'Jego dziewczyna Piątek', 'His Girl Friday', 'jego-dziewczyna-piatek', 1940,
   'Redaktor Walter Burns nie zamierza puścić swojej byłej żony i najlepszej reporterki do spokojnego życia na prowincji. Werbalny ping-pong w tempie karabinu.',
   null, '/backdrops/cinema.jpg',
   'SD', '12', 92, 'USA', 'Howard Hawks', 'Cary Grant, Rosalind Russell, Ralph Bellamy', false, true),
  (15, 'movie', 'Brzdąc', 'The Kid', 'brzdac', 1921,
   'Tramp wychowuje porzuconego chłopca. Chaplin miesza slapstick z czułym dramatem — pierwszy pełnometrażowy film, który pokazał, że kino komediowe umie płakać.',
   null, '/backdrops/cinema.jpg',
   'SD', '7', 68, 'USA', 'Charlie Chaplin', 'Charlie Chaplin, Jackie Coogan, Edna Purviance', false, true),
  (16, 'series', 'Caminandes', 'Caminandes', 'caminandes', 2013,
   'Mała llama Koro uczy się, że świat Patagonii bywa złośliwy: ogrodzenia pod napięciem, kręte drogi i chciwy kondor. Trzy otwarte krótkometraże Blendera jako serial.',
   '/posters/caminandes.jpg', '/backdrops/cinema.jpg',
   'FHD', '7', null, 'Holandia', 'Pablo Vazquez', 'Kero, Koro', true, true),
  (17, 'show', 'Wieczór z domeną publiczną', 'Public Domain Night', 'wieczor-z-domena-publiczna', 2026,
   'Program o kinie, które należy do wszystkich. Krótkie odcinki: skąd wzięły się otwarte filmy, jak czytać kino nieme i dlaczego klasyka wciąż działa na dużym ekranie.',
   null, '/backdrops/cinema.jpg',
   'HD', '12', null, 'Polska', 'Redakcja Filmozy', 'Prowadzący', false, true),
  (18, 'show', 'Studio Open Movie', 'Open Movie Studio', 'studio-open-movie', 2026,
   'Zza kulis otwartych produkcji: Blender, domena publiczna, darmowe kodeki. Show o tym, jak robić kino, gdy prawa autorskie nie stoją na drodze.',
   null, '/backdrops/cinema.jpg',
   'HD', '7', null, 'Polska', 'Redakcja Filmozy', 'Goście studia', false, true)
on conflict do nothing;

insert into title_genres (title_id, genre_id) values
  (1, 2), (1, 6), (1, 11),
  (2, 2), (2, 4), (2, 10),
  (3, 2), (3, 7), (3, 1),
  (4, 2), (4, 4),
  (5, 2), (5, 6), (5, 4),
  (6, 5), (6, 12),
  (7, 5), (7, 8), (7, 9),
  (8, 5), (8, 8), (8, 9),
  (9, 7), (9, 8), (9, 9),
  (10, 6), (10, 8), (10, 1),
  (11, 6), (11, 8), (11, 9),
  (12, 7), (12, 5),
  (13, 12), (13, 6), (13, 1),
  (14, 6), (14, 9),
  (15, 6), (15, 3), (15, 8),
  (16, 2), (16, 6), (16, 11),
  (17, 9), (17, 3),
  (18, 2), (18, 9)
on conflict do nothing;

insert into video_sources (title_id, episode_id, label, url, kind, language, is_primary) values
  (1,  null, 'Odtwarzacz HD', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'mp4', 'en', true),
  (2,  null, 'Odtwarzacz HD', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 'mp4', 'en', true),
  (3,  null, 'Odtwarzacz HD', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 'mp4', 'en', true),
  (4,  null, 'Odtwarzacz HD', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'mp4', 'en', true),
  (5,  null, 'Odtwarzacz HD', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'mp4', 'en', true),
  (6,  null, 'Odtwarzacz', 'https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4', 'mp4', 'en', true),
  (7,  null, 'Odtwarzacz', 'https://archive.org/download/Nosferatu_1922/Nosferatu.mp4', 'mp4', 'de', true),
  (8,  null, 'Odtwarzacz', 'https://archive.org/download/DasKabinettdesDoktorCaligariTheCabinetofDrCaligari/TheCabinetOfDrCaligari.mp4', 'mp4', 'de', true),
  (9,  null, 'Odtwarzacz', 'https://archive.org/download/Metropolis1927Restored/Metropolis.mp4', 'mp4', 'de', true),
  (10, null, 'Odtwarzacz', 'https://archive.org/download/TheGeneral_1926/The_General_512kb.mp4', 'mp4', 'en', true),
  (11, null, 'Odtwarzacz', 'https://archive.org/download/SherlockJr_729/Sherlock_Jr_512kb.mp4', 'mp4', 'en', true),
  (12, null, 'Odtwarzacz', 'https://archive.org/download/Plan9FromOuterSpace1959/Plan_9_from_Outer_Space.mp4', 'mp4', 'en', true),
  (13, null, 'Odtwarzacz', 'https://archive.org/download/charade_201512/Charade.mp4', 'mp4', 'en', true),
  (14, null, 'Odtwarzacz', 'https://archive.org/download/his_girl_friday/his_girl_friday_512kb.mp4', 'mp4', 'en', true),
  (15, null, 'Odtwarzacz', 'https://archive.org/download/TheKid1921/The_Kid_512kb.mp4', 'mp4', 'en', true)
on conflict do nothing;

insert into seasons (id, title_id, season_number, name) values
  (1, 16, 1, 'Sezon 1'),
  (2, 17, 1, 'Sezon 1'),
  (3, 18, 1, 'Sezon 1')
on conflict do nothing;

insert into episodes (id, season_id, episode_number, title, description, runtime_minutes) values
  (1, 1, 1, 'Llama Drama', 'Kero próbuje dostać się do smacznego kaktusa po drugiej stronie ogrodzenia pod napięciem.', 2),
  (2, 1, 2, 'Gran Dillama', 'Koro odkrywa, że skróty przez górską drogę bywają bolesne.', 2),
  (3, 1, 3, 'Llamigos', 'Dwie lamy, jeden kondor i wyścig o ostatnią marchewkę.', 3),
  (4, 2, 1, 'Co to jest domena publiczna?', 'Krótki wstęp: które filmy wolno odtwarzać, kopiować i pokazywać bez zgody studia.', 4),
  (5, 2, 2, 'Jak oglądać kino nieme', 'Rytm, plansze dialogowe, muzyka — przewodnik po seansie bez słów.', 5),
  (6, 3, 1, 'Dlaczego Blender oddał filmy za darmo', 'Open Movie Project i idea, że kino może być dobrem wspólnym.', 4),
  (7, 3, 2, 'Gdzie trzymać pliki legalnie', 'Internet Archive, własne R2, Bunny — skąd brać strumień do odtwarzacza.', 5)
on conflict do nothing;

insert into video_sources (title_id, episode_id, label, url, kind, language, is_primary) values
  (null, 1, 'Odtwarzacz', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'mp4', 'en', true),
  (null, 2, 'Odtwarzacz', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'mp4', 'en', true),
  (null, 3, 'Odtwarzacz', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'mp4', 'en', true),
  (null, 4, 'Odtwarzacz', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 'mp4', 'pl', true),
  (null, 5, 'Odtwarzacz', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', 'mp4', 'pl', true),
  (null, 6, 'Odtwarzacz', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4', 'mp4', 'pl', true),
  (null, 7, 'Odtwarzacz', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', 'mp4', 'pl', true)
on conflict do nothing;

select setval('genres_id_seq', (select coalesce(max(id), 1) from genres));
select setval('titles_id_seq', (select coalesce(max(id), 1) from titles));
select setval('seasons_id_seq', (select coalesce(max(id), 1) from seasons));
select setval('episodes_id_seq', (select coalesce(max(id), 1) from episodes));
select setval('video_sources_id_seq', (select coalesce(max(id), 1) from video_sources));
