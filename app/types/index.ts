export interface Shop {
  company: string;
  users: string;
  pos_shop_name: string;
  email: string;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateShopRequest {
  company: string;
  users: string;
  pos_shop_name: string;
  email: string;
  password: string;
}

export interface ApiError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }> | string;
}

// Product Management Types

export interface PromoterAssignment {
  id: number;
  products: string;
  article_code: number;
  promoter: string;
  created_at: string;
  updated_at: string;
}

export interface Price {
  id: number;
  pricelist: string;
  product: string;
  price: number;
  gst: number;
  created_at: string;
  updated_at: string;
}

export interface StorePromoter {
  id: number;
  promoter: string;
  point_of_sale: string;
  state?: string;
}

export interface StoreAssignment {
  id: number;
  store_id: number;
  product_id: string;
  store_name: string;
  state_name: string;
  promoters: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  product_id: string;
  product_type: string;
  product_description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  promoter_assignments: PromoterAssignment[];
  prices: Price[];
  store_assignments: StoreAssignment[];
}

export interface CreateProductRequest {
  product_id: string;
  product_type: string;
  product_description: string;
  is_active: boolean;
  promoter_assignments?: {
    article_code: number;
    promoter: string;
  }[];
  prices?: {
    pricelist: string;
    price: number;
    gst: number;
  }[];
  store_ids?: number[];
  auto_create_article_codes?: boolean;
  base_article_code?: number;
}

export interface UpdateProductRequest {
  product_type?: string;
  product_description?: string;
  is_active?: boolean;
}

export interface CreatePromoterAssignmentRequest {
  article_code: number;
  promoter: string;
}

export interface UpdatePromoterAssignmentRequest {
  promoter: string;
}

export interface CreatePriceRequest {
  pricelist: string;
  product: string;
  price: number;
  gst: number;
}

export interface UpdatePriceRequest {
  pricelist?: string;
  product?: string;
  price?: number;
  gst?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface PricesResponse {
  prices: Price[];
  total: number;
  skip: number;
  limit: number;
}

export interface StorePromotersResponse {
  store_id: number;
  store_name: string;
  state: string;
  promoters: StorePromoter[];
  total_promoters: number;
}

export interface ProductStoresWithPromotersResponse {
  product_id: string;
  product_description: string;
  stores: {
    store_id: number;
    store_name: string;
    state: string;
    is_available: boolean;
    promoters: StorePromoter[];
  }[];
  total_stores: number;
}

export interface AvailableStore {
  store_id: number;
  store_name: string;
  state_id: number;
  is_active: boolean;
}

export interface AvailableStoresResponse {
  stores: AvailableStore[];
  total: number;
}

// Store Product Types
export interface StoreProduct {
  id: number;
  ykey: string;
  product_name: string;
  store: string;
  state: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStoreProductRequest {
  ykey: string;
  product_name: string;
  store: string;
  state: string;
}

export interface BulkCreateStoreProductRequest {
  entries: {
    ykey: string;
    product_name: string;
    store: string;
    state: string;
  }[];
}

export interface BulkCreateStoreProductResponse {
  success: boolean;
  created_count: number;
  updated_count: number;
  failed_count: number;
  errors: any[];
}

export interface UpdateStoreProductRequest {
  ykey?: string;
  product_name?: string;
  store?: string;
  state?: string;
}

export interface StoreProductsResponse {
  items: StoreProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface StoreProductStatsOverview {
  total_entries: number;
  unique_ykeys: number;
  unique_stores: number;
  unique_states: number;
}

export interface StoreProductStatsByState {
  state: string;
  count: number;
}

export interface StoreProductStatsByStore {
  store: string;
  state: string;
  count: number;
}

export interface StoreProductStatsByYkey {
  ykey: string;
  product_name: string;
  count: number;
}

// Article Code Types
export interface ArticleCode {
  id: number;
  products: string;
  article_codes: number;
  promoter: string;
  created_at: string;
  updated_at: string;
}

export interface CreateArticleCodeRequest {
  products: string;
  article_codes: number;
  promoter: string;
}

export interface UpdateArticleCodeRequest {
  products?: string;
  article_codes?: number;
  promoter?: string;
}

export interface ArticleCodesResponse {
  items: ArticleCode[];
  total: number;
}

// Price POS Types
export interface PricePos {
  id: number;
  state: string;
  point_of_sale: string;
  promoter: string;
  pricelist: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePricePosRequest {
  state: string;
  point_of_sale: string;
  promoter: string;
  pricelist: string;
}

export interface BulkCreatePricePosRequest {
  entries: {
    state: string;
    point_of_sale: string;
    promoter: string;
    pricelist: string;
  }[];
}

export interface BulkCreatePricePosResponse {
  success: boolean;
  created_count: number;
  updated_count: number;
  failed_count: number;
  errors: any[];
}

export interface UpdatePricePosRequest {
  state?: string;
  point_of_sale?: string;
  promoter?: string;
  pricelist?: string;
}

export interface PricePosResponse {
  items: PricePos[];
  total: number;
  skip: number;
  limit: number;
}

export interface PricePosStatsOverview {
  total_entries: number;
  unique_states: number;
  unique_pos: number;
  unique_promoters: number;
  unique_pricelists: number;
}

export interface PricePosStatsByState {
  state: string;
  count: number;
}

export interface PricePosStatsByPromoter {
  promoter: string;
  count: number;
}

export interface PricePosStatsByPricelist {
  pricelist: string;
  count: number;
}

// Price Consolidated Types
export interface PriceConsolidated {
  id: number;
  pricelist: string;
  product: string;
  price: number;
  gst: number | null;
  created_at: string;
  updated_at: string;
  price_with_gst?: number | null;
}

export interface CreatePriceConsolidatedRequest {
  pricelist: string;
  product: string;
  price: number;
  gst?: number | null;
}

export interface BulkCreatePriceConsolidatedRequest {
  entries: {
    pricelist: string;
    product: string;
    price: number;
    gst?: number | null;
  }[];
}

export interface BulkCreatePriceConsolidatedResponse {
  success: boolean;
  created_count: number;
  updated_count: number;
  failed_count: number;
  errors: any[];
}

export interface UpdatePriceConsolidatedRequest {
  pricelist?: string;
  product?: string;
  price?: number;
  gst?: number | null;
}

export interface PriceConsolidatedResponse {
  items: PriceConsolidated[];
  total: number;
  skip: number;
  limit: number;
}

export interface PriceConsolidatedStatsOverview {
  total_entries: number;
  unique_pricelists: number;
  unique_products: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  entries_with_gst: number;
}

export interface PriceConsolidatedStatsByPricelist {
  pricelist: string;
  count: number;
  avg_price: number;
}

export interface PriceConsolidatedStatsByProduct {
  product: string;
  count: number;
  min_price: number;
  max_price: number;
  avg_price: number;
}

export interface PriceLookupRequest {
  product: string;
  pricelist?: string;
}

export interface PriceLookupResponse {
  found: boolean;
  entries: PriceConsolidated[];
  message: string;
}

// POS Entry Types
export interface POSBarcodeProduct {
  id?: string;
  barcode: string;
  product: string;
  price: number;
  article_code: number;
  weight_code: string | null;
  barcode_format: string;
  store_name: string;
  pricelist: string;
  weight: number | null;
  gst: number;
  price_with_gst: number;
  created_at?: string;
}

export interface POSBarcodePage {
  id?: string;
  page_number: number;
  count: number;
  products: POSBarcodeProduct[];
  created_at?: string;
}

export interface POSItem {
  id?: string;
  ykey: string;
  product: string;
  quantity: number;
  price: number;
  unit: string;
  discount: number;
  store_name?: string;
  created_at?: string;
}

export interface POSGeneralNote {
  id: string;
  note_date: string;
  promoter_name: string;
  note: string;
  store_name: string;
  created_at: string;
  updated_at: string;
}

export interface POSEntry {
  id: string;
  note_date: string;
  promoter_name: string;
  store_name: string;
  total_items: number;
  total_barcode_pages: number;
  created_at: string;
  updated_at: string;
}

export interface POSEntryDetail {
  general_note: POSGeneralNote;
  items: POSItem[];
  barcodes: POSBarcodePage[];
  total_items: number;
  total_barcode_pages: number;
  total_products_scanned: number;
}

export interface POSEntriesResponse {
  entries: POSEntry[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CreatePOSBarcodeProduct {
  barcode: string;
  product: string;
  price: number;
  article_code: number;
  weight_code?: string | null;
  barcode_format: string;
  store_name: string;
  pricelist: string;
  weight?: number | null;
  gst: number;
  price_with_gst: number;
}

export interface CreatePOSBarcodePage {
  page_number: number;
  store_name: string;
  products: CreatePOSBarcodeProduct[];
  total_count: number;
}

export interface CreatePOSGeneralNote {
  date: string; // DD-MM-YYYY format
  promoter_name: string;
  barcode_scanned_pages: CreatePOSBarcodePage[];
  total_barcode_count: number;
  note_text: string;
}

export interface CreatePOSItem {
  ykey: string;
  product: string;
  quantity: number;
  price: number;
  unit: string;
  discount: number;
}

export interface CreatePOSEntryRequest {
  items: CreatePOSItem[];
  general_note: CreatePOSGeneralNote;
  store_name: string;
}

export interface UpdatePOSEntryRequest {
  items: CreatePOSItem[];
  general_note: CreatePOSGeneralNote;
  store_name: string;
}

// POS Retrieval Types
export interface POSRetrievalEntry {
  id: string;
  date: string;
  general_note: string;
  store_name: string;
  ykey: string;
  product_name: string;
  unit_of_measurement: string;
  quantity: number;
  unit_price: number;
  gst_percentage: number;
  price_excluding_tax: number;
  price_including_tax: number;
  created_at: string;
}

// Response for download endpoints (/download, /download/all, /download/date-range)
export interface POSRetrievalDownloadResponse {
  data: POSRetrievalEntry[];
  total: number;
  downloaded_at: string;
}

// Response for paginated display endpoint (/api/pos-retrieval)
export interface POSRetrievalPaginatedResponse {
  data: POSRetrievalEntry[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Response for stores endpoint
export interface POSRetrievalStoresResponse {
  stores: string[];
  total: number;
}

// Legacy alias for backwards compatibility
export type POSRetrievalResponse = POSRetrievalDownloadResponse;

// Stock Take / Variance Report Types
export interface StockVarianceEntry {
  start_date: string;
  end_date: string;
  product: string;
  unit_of_measure: string;
  ykey: string;
  open_qty: number;
  close_qty: number;
  difference_qty: number;
  pos_total_sale: number;
  variance: number;
}

export interface StockVarianceDownloadResponse {
  store_name: string;
  start_date: string | null;
  end_date: string | null;
  data: StockVarianceEntry[];
  total: number;
  downloaded_at: string;
}

