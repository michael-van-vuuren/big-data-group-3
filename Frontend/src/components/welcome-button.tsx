import { Button } from "@/components/button";
import styles from "@/sections/styles.module.css";

interface WelcomeButtonProps {
  message: string;
}

export default function WelcomeButton({ message }: WelcomeButtonProps) {
  const variant = message === "Get Started" ? "heroButtonSlide" : "heroButton";

  return (
    <Button className={styles.card} variant={variant}>
      <span className="relative z-10">{message}</span>
    </Button>
  );
}
