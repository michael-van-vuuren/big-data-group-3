import styles from '@/sections/styles.module.css';
import { Button } from '@/components/ui/button';

export default function LoginButton() {
    return (
        <Button className={styles.card} variant="whiteBlack">
            Log In & Take The Quiz
        </Button>
    )
}
