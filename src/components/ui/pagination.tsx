import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { memo } from "react";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

interface PaginationProps {
	page: number;
	pageCount: number;
	onPageChange: (page: number) => void;
	className?: string;
}

function getPageList(page: number, pageCount: number) {
	if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);

	const list: (number | "ellipsis-left" | "ellipsis-right")[] = [];
	list.push(1);
	if (page > 3) list.push("ellipsis-left");
	const start = Math.max(2, page - 1);
	const end = Math.min(pageCount - 1, page + 1);
	for (let p = start; p <= end; p++) list.push(p);
	if (page < pageCount - 2) list.push("ellipsis-right");
	list.push(pageCount);
	return list;
}

export default memo(function Pagination({
	page,
	pageCount,
	onPageChange,
	className,
}: PaginationProps) {
	if (pageCount <= 1) return null;

	const items = getPageList(page, pageCount);

	return (
		<nav
			aria-label="Pagination"
			className={cn("flex items-center justify-center gap-1", className)}
		>
			<Button
				variant="outline"
				size="icon"
				className="size-9"
				disabled={page <= 1}
				onClick={() => onPageChange(Math.max(1, page - 1))}
				aria-label="Previous page"
			>
				<ChevronLeft className="size-4" />
			</Button>
			{items.map((item) =>
				item === "ellipsis-left" || item === "ellipsis-right" ? (
					<span
						key={item}
						className="flex size-9 items-center justify-center text-muted-foreground"
					>
						<MoreHorizontal className="size-4" />
					</span>
				) : (
					<Button
						key={item}
						variant={item === page ? "default" : "outline"}
						size="icon"
						className="size-9"
						aria-current={item === page ? "page" : undefined}
						onClick={() => onPageChange(item)}
					>
						{item}
					</Button>
				),
			)}
			<Button
				variant="outline"
				size="icon"
				className="size-9"
				disabled={page >= pageCount}
				onClick={() => onPageChange(Math.min(pageCount, page + 1))}
				aria-label="Next page"
			>
				<ChevronRight className="size-4" />
			</Button>
		</nav>
	);
});
