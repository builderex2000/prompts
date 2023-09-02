import HttpError from '@wasp/core/HttpError.js'

export const createPrompt = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const { title, description, isPublic } = args;

  // Create the prompt
  const newPrompt = await context.entities.Prompt.create({
    data: {
      title,
      description,
      isPublic,
      userId: context.user.id
    }
  });

  // Create associated NFT if isPublic is true
  let newNFT = null;
  if (isPublic) {
    newNFT = await context.entities.NFT.create({
      data: {
        name: `NFT for Prompt ${newPrompt.id}`, // Example of NFT name
        price: 10, // Example of NFT price
        url: `https://example.com/nfts/${newPrompt.id}`, // Example of NFT URL
        prompt: { connect: { id: newPrompt.id } }
      }
    });
  }

  return { prompt: newPrompt, nft: newNFT };
}

export const updatePrompt = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const prompt = await context.entities.Prompt.findUnique({
    where: { id: args.id }
  });
  if (!prompt || prompt.userId !== context.user.id) { throw new HttpError(403) }

  const updatedPrompt = await context.entities.Prompt.update({
    where: { id: args.id },
    data: {
      title: args.title,
      description: args.description,
      isPublic: args.isPublic
    }
  });

  let updatedNFT;
  if (args.isPublic && prompt.nft) {
    updatedNFT = await context.entities.NFT.update({
      where: { id: prompt.nft.id },
      data: { name: args.title }
    });
  }

  return { prompt: updatedPrompt, nft: updatedNFT };
}

export const deletePrompt = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const prompt = await context.entities.Prompt.findUnique({
    where: { id: args.promptId }
  });

  if (!prompt) throw new Error('Prompt not found.');
  if (prompt.userId !== context.user.id) { throw new HttpError(403) };

  const nft = await context.entities.NFT.findUnique({
    where: { promptId: args.promptId }
  });

  await context.entities.NFT.delete({ where: { id: nft.id } });

  await context.entities.Prompt.delete({ where: { id: args.promptId } });

  return { id: args.promptId };
}