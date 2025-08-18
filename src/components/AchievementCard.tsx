import { CheckCircle } from "lucide-react";
import { cn, getRarityColor } from "../utils/utils";

interface AchievementCardProps {
  id: number;
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  earned: boolean;
  date?: string;
  progress?: number;
  total?: number;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  id,
  name,
  description,
  icon: Icon,
  rarity,
  earned,
  date,
  progress,
  total,
}) => {
  const rarityColor = getRarityColor(rarity);
  const progressPercent = progress && total ? (progress / total) * 100 : 0;

  return (
    <div
      key={id}
      className={cn(
        "bg-white/10 backdrop-blur-sm rounded-xl p-6 border",
        earned
          ? "border-white/20 hover:bg-white/15"
          : "border-white/10 opacity-60"
      )}
    >
      <div className="flex items-start space-x-4">
        <div className={cn("p-3 rounded-lg", rarityColor)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <span
              className={cn(
                "px-2 py-1 rounded text-xs capitalize",
                rarityColor
              )}
            >
              {rarity}
            </span>
          </div>
          <p className="text-blue-200 text-sm mb-3">{description}</p>

          {earned ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">
                Earned on{" "}
                {date ? new Date(date).toLocaleDateString() : "Unknown date"}
              </span>
            </div>
          ) : progress ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-200">Progress</span>
                <span className="text-white">
                  {progress} / {total}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Not started</span>
          )}
        </div>
      </div>
    </div>
  );
};
