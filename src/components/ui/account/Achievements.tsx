import { TrophyIcon } from "lucide-react";
import { achievements } from "../../../constants/achievements";
import { AchievementCard } from "../../AchievementCard";
import Card from "../../Card";

export default function Achievements() {
    return (
        <Card className="space-y-6" bg="transparent" padding="p-2">
            <Card.Header
                title="Milestones"
                subtitle="Track your progress and unlocks"
                icon={<TrophyIcon className="w-6 h-5 text-yellow-500" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                    <AchievementCard
                        key={achievement.id}
                        index={index}
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
        </Card>
    );
}
