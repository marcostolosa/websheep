import { pbkdf2Sync } from 'crypto';
import { Router } from 'express';
import { farmers } from '../../lib/farmers';
import { tokens } from '../../lib/tokens';

export const tokensRouter = Router();

tokensRouter.post('/tokens', async (req, res) => {
  const userId = req.body.userName;
  const password = req.body.password;

  const farmer = farmers.get({ farmerId: userId });

  const passwordHash = pbkdf2Sync(
    password,
    userId,
    1000,
    32,
    'sha512'
  ).toString('base64');

  console.log(passwordHash);

  if (farmer == null || farmer.passwordHash !== passwordHash) {
    res.status(401).end();
    return;
  }

  const tokenInfo = await tokens.create({ userId });

  res.json({
    ...tokenInfo,
    userId
  });
});

tokensRouter.delete('/tokens/:tokenId', (req, res) => {
  const { tokenId } = req.params;

  tokens.delete({ tokenId });

  res.status(204).end();
});
