export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "text-gray-400 bg-gray-500/20";
    case "uncommon":
      return "text-green-400 bg-green-500/20";
    case "rare":
      return "text-blue-400 bg-blue-500/20";
    case "epic":
      return "text-purple-400 bg-purple-500/20";
    case "legendary":
      return "text-yellow-400 bg-yellow-500/20";
    default:
      return "text-gray-400 bg-gray-500/20";
  }
};
