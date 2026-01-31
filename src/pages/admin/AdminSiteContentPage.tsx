import AdminPageLayout from "@/components/layout/AdminPageLayout";
import { SiteContentEditor } from "@/components/admin/SiteContentEditor";

const AdminSiteContentPage = () => {
  return (
    <AdminPageLayout
      title="Site Content"
      subtitle="Edit text displayed on public pages"
    >
      <div className="max-w-4xl">
        <SiteContentEditor />
      </div>
    </AdminPageLayout>
  );
};

export default AdminSiteContentPage;
