const routes = (handler) => [
  {
    method: 'POST',
    path: '/mangas',
    handler: handler.postMangaHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/mangas/{id}',
    handler: handler.getMangaByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/mangas/{id}',
    handler: handler.putMangaByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/mangas/{id}',
    handler: handler.deleteMangaByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

module.exports = routes;
