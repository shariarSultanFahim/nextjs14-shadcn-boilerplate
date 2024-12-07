import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="flex flex-row items-center gap-2 p-3">
			<Button>Click me</Button>
			<Button variant="secondary">Click me</Button>
			<Button variant="outline">Click me</Button>
			<Button variant="link">Click me</Button>
			<Button variant="ghost">Click me</Button>
			<Button variant="destructive">Click me</Button>
		</div>
	);
}
