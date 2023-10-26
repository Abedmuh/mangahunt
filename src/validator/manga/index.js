const InvariantError = require('../../exceptions/InvariantError');
const { MangaPayloadSchema } = require('./schema');

const MangaValidator = {
  validateMangaPayload: (payload) => {
    const validationResult = MangaPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = MangaValidator;
