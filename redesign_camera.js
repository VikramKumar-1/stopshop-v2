const fs = require('fs');
const path = 'src/app/vendor/camera/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Update List Item UI to include Product Image and OrderNumber
const oldListItem = `
                      <div>
                        <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                          Order #{ord.id}
                        </span>
                        <h4 className="text-xs font-bold text-heading mt-1">{ord.shippingName || "Customer"}</h4>
                        <p className="text-[10px] text-muted">₹{((ord.totalPaise || 0) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })} • {ord.items?.length || 1} items</p>
                      </div>
                      <span className="px-3 py-1.5 bg-orange-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1">
                        <Camera size={12} /> Snap Photos
                      </span>
`;

const newListItem = `
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-12 h-12 rounded-xl border border-border/80 overflow-hidden flex-shrink-0 bg-surface">
                          <img src={(ord.items && ord.items[0]?.productImage) || "/logo4.jpg"} alt="product" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-1">
                            {ord.orderNumber || ord.id.slice(-6).toUpperCase()}
                          </span>
                          <h4 className="text-xs font-bold text-heading truncate">{ord.shippingName || "Customer"}</h4>
                          <p className="text-[10px] text-muted">₹{((ord.totalPaise || 0) / 100).toLocaleString("en-IN")} • {ord.items?.length || 1} items</p>
                        </div>
                        <span className="px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-md flex-shrink-0">
                          <Camera size={14} /> Pack
                        </span>
                      </div>
`;
code = code.replace(oldListItem, newListItem);

// 2. Update Search Bar to look more scanner-friendly
const oldSearchBar = `
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Scan or Enter Order ID..."
                    value={searchOrderId}
                    onChange={(e) => setSearchOrderId(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-orange-500 font-mono shadow-sm"
                  />
                </div>
`;
const newSearchBar = `
                <div className="mb-4 bg-orange-500/5 p-3 rounded-2xl border border-orange-500/20">
                  <label className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles size={12} /> Scan Barcode to Pack
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tap here & use phone scanner..."
                      value={searchOrderId}
                      onChange={(e) => setSearchOrderId(e.target.value)}
                      className="w-full bg-surface border-2 border-orange-500/30 rounded-xl pl-10 pr-4 py-3.5 text-xs focus:outline-none focus:border-orange-500 font-mono shadow-inner"
                    />
                    <Camera size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500" />
                  </div>
                </div>
`;
code = code.replace(oldSearchBar, newSearchBar);


// 3. Update Detail View for Order (Selected Order) to show Product Info and TWO upload buttons
const oldDetailViewStart = `
              <div className="bg-surface-card border border-border/80 rounded-3xl p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-start border-b border-border/60 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                      Order #{selectedOrder.id}
                    </span>
                    <p className="text-xs font-bold text-heading mt-1">{selectedOrder.customerName || "Customer"}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedOrder(null); setPackingImages([]); }}
                    className="text-xs font-bold text-muted hover:text-heading"
                  >
                    Cancel
                  </button>
                </div>

                {/* Snap Camera Section */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-muted uppercase">
                    Snap 5 to 8 Mandatory Packing Photos *
                  </label>
                  <p className="text-[10px] text-muted">Take clear photos of item, bubble wrap, box, and shipping label.</p>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="cam-packing-photos"
                    onChange={handleSnapPackingPhotos}
                    className="sr-only"
                  />
                  <label
                    htmlFor="cam-packing-photos"
                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {uploadingPacking ? <Loader2 size={16} className="animate-spin" /> : <Camera size={18} />}
                    <span>Snap Photo with Camera ({packingImages.length}/8)</span>
                  </label>
                </div>
`;

const newDetailViewStart = `
              <div className="bg-surface-card border border-border/80 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                <div className="flex justify-between items-start border-b border-border/60 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                      Order {selectedOrder.orderNumber || selectedOrder.id.slice(-6).toUpperCase()}
                    </span>
                    <p className="text-xs font-bold text-heading mt-1.5">{selectedOrder.shippingName || "Customer"}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedOrder(null); setPackingImages([]); }}
                    className="w-8 h-8 flex items-center justify-center bg-surface hover:bg-surface-hover rounded-full border border-border text-muted transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Show Products to Pack */}
                <div className="space-y-2 bg-surface p-3 rounded-2xl border border-border/60">
                  <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Items to Pack ({selectedOrder.items?.length || 0})</label>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 bg-surface-card p-2 rounded-xl border border-border/50">
                        <img src={item.productImage || "/logo4.jpg"} alt={item.productName} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-heading truncate">{item.productName}</p>
                          <div className="flex gap-2 items-center mt-1">
                            <span className="text-[9px] font-bold bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded">Qty: {item.quantity}</span>
                            <span className="text-[9px] text-muted truncate">{item.productMaterial}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-heading uppercase">
                      Upload Packing Proof
                    </label>
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">{packingImages.length} / 8</span>
                  </div>
                  <p className="text-[10px] text-muted leading-tight">Please upload clear photos of the item, bubble wrapping, box sealing, and shipping label.</p>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Camera Button */}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      id="cam-packing-live"
                      onChange={handleSnapPackingPhotos}
                      className="sr-only"
                    />
                    <label
                      htmlFor="cam-packing-live"
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {uploadingPacking ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                      <span>Use Camera</span>
                    </label>

                    {/* Gallery Button */}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="cam-packing-gallery"
                      onChange={handleSnapPackingPhotos}
                      className="sr-only"
                    />
                    <label
                      htmlFor="cam-packing-gallery"
                      className="w-full py-3 bg-surface hover:bg-surface-hover text-heading border border-border rounded-2xl font-bold text-xs shadow-sm transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {uploadingPacking ? <Loader2 size={18} className="animate-spin text-orange-500" /> : <ImageIcon size={18} className="text-blue-500" />}
                      <span>Pick Gallery</span>
                    </label>
                  </div>
                </div>
`;
code = code.replace(oldDetailViewStart, newDetailViewStart);


fs.writeFileSync(path, code);
console.log('Done rewriting page.tsx UI.');
