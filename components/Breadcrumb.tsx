import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      item: item.href ? `https://entratta.com.br${item.href}` : undefined,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav className="mb-6 text-sm text-gray-600">
        <ol className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              {item.href ? (
                <>
                  <Link href={item.href} className="text-brand hover:underline">
                    {item.label}
                  </Link>
                  {idx < items.length - 1 && <span className="text-gray-400">/</span>}
                </>
              ) : (
                <>
                  <span className="text-gray-800 font-medium">{item.label}</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
