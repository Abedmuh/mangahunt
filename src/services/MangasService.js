const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');
const { mapDBToModel } = require('../utils');

class MangasService {
  constructor() {
    this._pool = new Pool();
  }

  async addManga({ title, author, tags, studios, premiered, license }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO manga VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, author, tags, studios, premiered, license],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getMangaById(id) {
    const query = {
      text: 'SELECT * FROM manga WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Manga tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editMangaById(id, { title, author, tags }) {
    const query = {
      text: 'UPDATE manga SET title = $1, author = $2, tags = $3, studios = $4, premiered = $5, license = $6 WHERE id = $7 RETURNING id',
      values: [title, author, tags, studios, premiered, license, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteMangaById(id) {
    const query = {
      text: 'DELETE FROM manga WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyMangaOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM manga WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    const manga = result.rows[0];
    if (manga.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = MangasService;
