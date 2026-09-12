-- Local, always-playable streams for the preview + a second remote player when the host is reachable.
delete from video_sources;

insert into video_sources (title_id, episode_id, label, url, kind, language, is_primary) values
  (1,  null, 'Odtwarzacz', '/videos/big-buck-bunny.mp4', 'mp4', 'en', true),
  (2,  null, 'Odtwarzacz', '/videos/sintel.mp4', 'mp4', 'en', true),
  (3,  null, 'Odtwarzacz', '/videos/cinema.mp4', 'mp4', 'en', true),
  (4,  null, 'Odtwarzacz', '/videos/elephants-dream.mp4', 'mp4', 'en', true),
  (5,  null, 'Odtwarzacz', '/videos/cosmos-laundromat.mp4', 'mp4', 'en', true),
  (6,  null, 'Odtwarzacz', '/videos/night-of-the-living-dead.mp4', 'mp4', 'en', true),
  (7,  null, 'Odtwarzacz', '/videos/nosferatu.mp4', 'mp4', 'en', true),
  (8,  null, 'Odtwarzacz', '/videos/cinema.mp4', 'mp4', 'de', true),
  (9,  null, 'Odtwarzacz', '/videos/metropolis.mp4', 'mp4', 'de', true),
  (10, null, 'Odtwarzacz', '/videos/the-general.mp4', 'mp4', 'en', true),
  (11, null, 'Odtwarzacz', '/videos/the-general.mp4', 'mp4', 'en', true),
  (12, null, 'Odtwarzacz', '/videos/night-of-the-living-dead.mp4', 'mp4', 'en', true),
  (13, null, 'Odtwarzacz', '/videos/cinema.mp4', 'mp4', 'en', true),
  (14, null, 'Odtwarzacz', '/videos/cinema.mp4', 'mp4', 'en', true),
  (15, null, 'Odtwarzacz', '/videos/cinema.mp4', 'mp4', 'en', true),
  (null, 1, 'Odtwarzacz', '/videos/caminandes.mp4', 'mp4', 'en', true),
  (null, 2, 'Odtwarzacz', '/videos/flower.mp4', 'mp4', 'en', true),
  (null, 3, 'Odtwarzacz', '/videos/caminandes.mp4', 'mp4', 'en', true),
  (null, 4, 'Odtwarzacz', '/videos/cinema.mp4', 'mp4', 'pl', true),
  (null, 5, 'Odtwarzacz', '/videos/cinema.mp4', 'mp4', 'pl', true),
  (null, 6, 'Odtwarzacz', '/videos/cinema.mp4', 'mp4', 'pl', true),
  (null, 7, 'Odtwarzacz', '/videos/flower.mp4', 'mp4', 'pl', true);

select setval('video_sources_id_seq', (select coalesce(max(id), 1) from video_sources));
