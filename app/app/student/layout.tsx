import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { StudentSidebar } from "./student-sidebar";

export default function FacultyLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<StudentSidebar />
			<SidebarInset>
				<header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
				</header>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}