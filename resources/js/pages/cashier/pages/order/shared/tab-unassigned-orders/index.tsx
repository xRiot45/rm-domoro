import { TabsContent } from '@/components/ui/tabs';

const TabContentUnassignedOrders = () => {
    return (
        <TabsContent value="unassignedOrders">
            {/* Konten untuk tab "Pesanan Masuk" */}
            <div className="mt-4">
                <p className="text-muted-foreground text-sm">Menampilkan pesanan self-order yang belum ditangani.</p>
                {/* Ganti dengan komponen daftar transaksi yang belum memiliki cashier_id */}
            </div>
        </TabsContent>
    );
};

export default TabContentUnassignedOrders;
