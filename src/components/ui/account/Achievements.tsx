import { achievements } from "../../../constants/achievements";
import { AchievementCard } from "../../AchievementCard";

export default function Achievements() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            {...achievement}
            rarity={
              achievement.rarity as
                | "common"
                | "uncommon"
                | "rare"
                | "epic"
                | "legendary"
            }
          />
        ))}
      </div>
    </div>
  );
}
