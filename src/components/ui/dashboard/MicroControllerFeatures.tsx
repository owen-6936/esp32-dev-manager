import { features } from "../../../constants/microcontrollerfeatures";
import Card from "../../Card";
import ListItemCard from "../../ListItemCard";

export default function MicroControllerFeatures() {
  return (
    <Card index={2}>
      <Card.Header>ESP32 S3 Features</Card.Header>
      <Card.Body className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <ListItemCard key={feature.title} index={index} {...feature} />
        ))}
      </Card.Body>
    </Card>
  );
}
