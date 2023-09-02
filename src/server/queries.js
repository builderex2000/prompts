import HttpError from '@wasp/core/HttpError.js';


export const getPrompt = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const prompt = await context.entities.Prompt.findUnique({
    where: { id: args.promptId },
    include: { nft: true }
  });

  if (!prompt) { throw new HttpError(404, `Prompt with id ${args.promptId} not found`); }

  if (!prompt.isPublic && prompt.userId !== context.user.id) { throw new HttpError(403, 'Unauthorized'); }

  return prompt;
};

export const getUserPrompts = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  return context.entities.Prompt.findMany({
    where: {
      userId: context.user.id
    },
    include: {
      nft: true
    }
  })
}

export const getPublicPrompts = async (args, context) => {
  const prompts = await context.entities.Prompt.findMany({
    where: {
      isPublic: true
    },
    include: {
      nft: true
    }
  });
  return prompts;
}