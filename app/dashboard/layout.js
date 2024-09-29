import Layout from '../components/Layout';  // Adjust the import path as needed

export default function DashboardLayout({ children }) {
    return (
        <Layout>
            <div className="flex h-screen">
                {/* Main content area */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </Layout>
    );
}
