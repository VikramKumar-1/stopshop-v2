import re
import sys

with open(r"c:\Users\vikur\Downloads\stopshops\src\features\admin\components\AdminPanel.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add imports
if "import useSWR" not in content:
    content = content.replace('import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";',
                              'import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";\nimport useSWR from "swr";\nimport { fetcher } from "@/lib/fetcher";')

# 2. Replace states with SWR
swr_hooks = """
  const { data: categoriesData, mutate: mutateCategories } = useSWR(authorized ? '/api/categories' : null, fetcher);
  const dbCategories = categoriesData || [];
  const { data: ordersData, mutate: mutateOrders } = useSWR(authorized ? `/api/orders?page=${orderPage}&limit=20` : null, fetcher);
  const orders = ordersData?.orders || [];
  const orderStats = ordersData?.stats || [];
  const orderTotalPages = ordersData?.pagination?.totalPages || 1;
  const { data: productsData, mutate: mutateProducts } = useSWR(authorized ? '/api/products' : null, fetcher);
  const products = productsData || [];
  const { data: vendorsData, mutate: mutateVendors } = useSWR(authorized ? '/api/admin/vendors' : null, fetcher);
  const vendors = vendorsData?.vendors || [];
  const { data: statsData, mutate: mutateStats } = useSWR(authorized ? '/api/admin/stats' : null, fetcher);
  const { data: settlementsData, mutate: mutateSettlements } = useSWR(authorized ? '/api/admin/settlements' : null, fetcher);
  const settlements = settlementsData?.settlements || [];
  const apiGroupedSettlements = settlementsData?.groupedSettlements || [];
  const apiSettlementSummary = settlementsData?.summary || null;
  const { data: returnsData, mutate: mutateReturns } = useSWR(authorized ? '/api/admin/returns' : null, fetcher);
  const returns = returnsData?.returns || [];
"""

# State deletions
states_to_remove = [
    r"const \[orders, setOrders\] = useState<any\[\]>\(\[\]\);",
    r"const \[orderStats, setOrderStats\] = useState<any\[\]>\(\[\]\);",
    r"const \[orderTotalPages, setOrderTotalPages\] = useState\(1\);",
    r"const \[fetchingOrders, setFetchingOrders\] = useState\(false\);",
    r"const \[returns, setReturns\] = useState<any\[\]>\(\[\]\);",
    r"const \[settlements, setSettlements\] = useState<any\[\]>\(\[\]\);",
    r"const \[apiGroupedSettlements, setApiGroupedSettlements\] = useState<any\[\]>\(\[\]\);",
    r"const \[apiSettlementSummary, setApiSettlementSummary\] = useState<any>\(null\);",
    r"const \[products, setProducts\] = useState<any\[\]>\(\[\]\);",
    r"const \[dbCategories, setDbCategories\] = useState<any\[\]>\(\[\]\);",
    r"const \[vendors, setVendors\] = useState<any\[\]>\(\[\]\);",
]

for state in states_to_remove:
    content = re.sub(state + r"\s*", "", content)

# Inject SWR hooks after useEffect(() => { checkAuth(); ...
swr_insert_marker = "const [orderPage, setOrderPage] = useState(1);"
content = content.replace(swr_insert_marker, swr_insert_marker + "\n" + swr_hooks)

# Remove fetchOrders, fetchVendors, fetchProducts, fetchSettlements, fetchReturns, fetchData
content = re.sub(r"const fetchOrders = async[\s\S]*?fetchOrders\(orderPage\);\n    }\n  }, \[orderPage, authorized\]\);\n", "", content)
content = re.sub(r"// Targeted refresh functions[\s\S]*?const fetchData = async[\s\S]*?setIsLoadingData\(false\);\n    }\n  };\n", "", content)

# Also remove:
# useEffect(() => { if (authorized) { fetchOrders(orderPage); } }, [orderPage, authorized]); 
# Actually handled by regex above partially? Let's be safer.

content = re.sub(r"const fetchVendors = async \(\) => \{[\s\S]*?\};\n", "", content)
content = re.sub(r"const fetchProducts = async \(\) => \{[\s\S]*?\};\n", "", content)
content = re.sub(r"const fetchSettlements = async \(\) => \{[\s\S]*?\};\n", "", content)
content = re.sub(r"const fetchReturns = async \(\) => \{[\s\S]*?\};\n", "", content)
content = re.sub(r"const fetchData = async \([\s\S]*?setIsLoadingData\(false\);\n    }\n  };\n", "", content)
content = re.sub(r"useEffect\(\(\) => \{\n    if \(authorized\) \{\n      fetchOrders\(orderPage\);\n    \}\n  \}, \[orderPage, authorized\]\);\n", "", content)

# Replace handleTabRefresh
handle_tab_refresh_replacement = """
  const handleTabRefresh = async () => {
    showToast(`Refreshing ${activeTab}...`, "success");
    if (activeTab === "orders") mutateOrders();
    else if (activeTab === "returns") mutateReturns();
    else if (activeTab === "settlements") mutateSettlements();
    else if (activeTab === "vendors") mutateVendors();
    else if (activeTab === "products") mutateProducts();
  };
"""
content = re.sub(r"const handleTabRefresh = async \(\) => \{[\s\S]*?setIsLoadingData\(false\);\n    }\n  };", handle_tab_refresh_replacement.strip(), content)


# Handle mutations
# setVendors -> mutateVendors
# setProducts -> mutateProducts
# setReturns -> mutateReturns
# setOrders -> mutateOrders
# setSettlements -> mutateSettlements

content = re.sub(r"setVendors\(vendors\.map\(vendor => vendor\.id === v\.id \? updatedVendorOptimistic : vendor\)\);", 
                 r"mutateVendors({ ...vendorsData, vendors: vendors.map(vendor => vendor.id === v.id ? updatedVendorOptimistic : vendor) }, false);", content)

content = re.sub(r"setVendors\(vendors\.map\(vendor => vendor\.id === v\.id \? v : vendor\)\);", 
                 r"mutateVendors();", content)

content = re.sub(r"setProducts\(prev => prev\.map\(p => p\.id === id \? \{ \.\.\.p, active: !currentActive \} : p\)\);", 
                 r"mutateProducts(products.map(p => p.id === id ? { ...p, active: !currentActive } : p), false);", content)

# fetchReturns(); -> mutateReturns();
content = re.sub(r"fetchReturns\(\);", "mutateReturns();", content)
content = re.sub(r"fetchVendors\(\);", "mutateVendors();", content)
content = re.sub(r"fetchData\(\);", "", content)

# update dependencies in loadMoreRef if fetchingOrders is still there
content = content.replace("if (fetchingOrders) return;", "// if (fetchingOrders) return;")
content = content.replace("[fetchingOrders, orderPage, orderTotalPages]", "[orderPage, orderTotalPages]")

with open(r"c:\Users\vikur\Downloads\stopshops\src\features\admin\components\AdminPanel.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
