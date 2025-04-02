import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'


interface BeanLibraryProps {
    subcategories: string[];
}

export default function BeanLibrary({ subcategories }: BeanLibraryProps) {
    return (
        <div className="border-none">
            <Table className="border-none">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]"> Selected Notes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subcategories.slice().reverse().map((subcategories) => (
                        <TableRow key={subcategories}>
                            <TableCell className="font-base">{subcategories}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-center mt-4">
                <Button>Done</Button>
            </div>
        </div>
    )
}


