const ClientError = require('../../exceptions/ClientError');

class MangaHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postMangaHandler = this.postMangaHandler.bind(this);
    this.getMangaByIdHandler = this.getMangaByIdHandler.bind(this);
    this.putMangaByIdHandler = this.putMangaByIdHandler.bind(this);
    this.deleteMangaByIdHandler = this.deleteMangaByIdHandler.bind(this);
  }

  async postMangaHandler(request, h) {
    try {
      this._validator.validateMangaPayload(request.payload);
      const {
        title = 'untitled',
        author,
        tags,
        studios,
        premiered,
        license,
      } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const mangaId = await this._service.addManga({
        title,
        author,
        tags,
        studios,
        premiered,
        license,
        owner: credentialId,
      });

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          mangaId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getMangaByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyMangaOwner(id, credentialId);
      const manga = await this._service.getMangaById(id);
      return {
        status: 'success',
        data: {
          manga,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putMangaByIdHandler(request, h) {
    try {
      this._validator.validateMangaPayload(request.payload);
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyMangaOwner(id, credentialId);
      await this._service.editMangaById(id, request.payload);

      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteMangaByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyMangaOwner(id, credentialId);
      await this._service.deleteMangaById(id);

      return {
        status: 'success',
        message: 'Catatan berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = MangaHandler;
