import { Typography } from "@mui/material";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Reusable feature component for displaying platform benefits with icon, title, and description
export default function Feature({ icon, title, description }: FeatureProps) {
  return (
    <li className="feature-item">
      <div className="feature-icon">{icon}</div>
      <div className="feature-text">
        <Typography variant="h6" component="h4">{title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </div>
    </li>
  );
} 