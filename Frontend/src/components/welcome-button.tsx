import { Button } from "@/components/ui/button";
import styles from "@/sections/styles.module.css";

interface WelcomeButtonProps {
  message: string;
}

export default function WelcomeButton({ message }: WelcomeButtonProps) {
  return (
    <Button className={styles.card} variant="whiteBlack">
      {message}
    </Button>
  );
}
