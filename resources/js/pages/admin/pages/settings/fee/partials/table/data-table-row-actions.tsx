import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FeeItem } from '@/models/fee';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { toast } from 'sonner';

export function DataTableRowActions({ row }: { row: Row<FeeItem> }) {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(row.original.amount);

    const handleUpdate = () => {
        router.put(
            route('admin.settings.fee.update', { id: row.original.id }),
            { amount },
            {
                onSuccess: () => {
                    setShowDialog(false);
                    toast.success('Success', {
                        description: 'Fee berhasil diupdate',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });
                },
                onError: (errors) => {
                    console.log(errors);
                    toast.error('Failed', {
                        description: 'Fee gagal diupdate',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });
                },
            },
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setShowDialog(true)}>
                        Edit Data
                        <DropdownMenuShortcut>
                            <Icon icon={'material-symbols:edit'} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Fee: {row.original.type}</DialogTitle>
                        <DialogDescription>Masukkan jumlah baru untuk fee ini.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-4">
                        <Label className="text-sm font-medium capitalize">{row.original.type}</Label>
                        <Input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate}>Update Biaya</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
