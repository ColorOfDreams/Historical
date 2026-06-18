export type NodeKind = "person" | "event" | "dynasty" | "place"

export interface GraphNode {
  id: string
  name: string
  kind: NodeKind
  period: string
  summary: string
  // normalized position in the constellation (0-100)
  x: number
  y: number
  relatedPeople: string[]
  relatedEvents: string[]
  relatedPlaces: string[]
}

export interface GraphEdge {
  from: string
  to: string
  label: string
}

export const kindLabel: Record<NodeKind, string> = {
  person: "Nhân vật",
  event: "Sự kiện",
  dynasty: "Triều đại",
  place: "Địa danh",
}

export const graphNodes: GraphNode[] = [
  {
    id: "tran-dynasty",
    name: "Nhà Trần",
    kind: "dynasty",
    period: "1225 – 1400",
    summary:
      "Triều đại rực rỡ bậc nhất trong lịch sử Đại Việt, nổi tiếng với ba lần đánh tan quân Nguyên Mông và nền văn hóa Thiền học phát triển.",
    x: 48,
    y: 22,
    relatedPeople: ["tran-hung-dao", "tran-nhan-tong", "tran-quang-khai", "tran-khanh-du"],
    relatedEvents: ["bach-dang-1288", "mongol-invasions", "dien-hong", "binh-than"],
    relatedPlaces: ["thang-long", "thien-truong"],
  },
  {
    id: "dai-viet-tran",
    name: "Đại Việt thời Trần",
    kind: "dynasty",
    period: "thế kỷ XIII",
    summary:
      "Không gian chính trị và văn hóa của Đại Việt dưới triều Trần, nơi sức mạnh triều đình, tôn thất, quân đội và cộng đồng làng xã cùng kết lại trong kháng chiến.",
    x: 34,
    y: 35,
    relatedPeople: ["tran-nhan-tong", "tran-hung-dao", "pham-ngu-lao"],
    relatedEvents: ["dien-hong", "mongol-invasions"],
    relatedPlaces: ["thang-long", "thien-truong", "yen-tu"],
  },
  {
    id: "yuan-dynasty",
    name: "Đế quốc Nguyên",
    kind: "dynasty",
    period: "1271 – 1368",
    summary:
      "Đế quốc do Hốt Tất Liệt lập nên, kế thừa sức mạnh quân sự Mông Cổ và nhiều lần mở chiến dịch xuống phía nam nhằm kiểm soát Đại Việt.",
    x: 73,
    y: 25,
    relatedPeople: ["thoat-hoan", "omar"],
    relatedEvents: ["mongol-invasions", "bach-dang-1288"],
    relatedPlaces: ["van-kiep", "bach-dang-river"],
  },
  {
    id: "tran-hung-dao",
    name: "Trần Hưng Đạo",
    kind: "person",
    period: "1228 – 1300",
    summary:
      "Hưng Đạo Đại Vương Trần Quốc Tuấn, vị Quốc công Tiết chế thống lĩnh quân đội Đại Việt, tác giả 'Hịch tướng sĩ' và 'Binh thư yếu lược'.",
    x: 47,
    y: 48,
    relatedPeople: ["tran-nhan-tong", "tran-quang-khai", "pham-ngu-lao", "yet-kieu"],
    relatedEvents: ["bach-dang-1288", "mongol-invasions", "binh-than"],
    relatedPlaces: ["bach-dang-river", "van-kiep", "thang-long"],
  },
  {
    id: "tran-nhan-tong",
    name: "Trần Nhân Tông",
    kind: "person",
    period: "1258 – 1308",
    summary:
      "Vị vua anh minh lãnh đạo hai cuộc kháng chiến chống Nguyên Mông, sau nhường ngôi đi tu và sáng lập Thiền phái Trúc Lâm Yên Tử.",
    x: 30,
    y: 50,
    relatedPeople: ["tran-hung-dao", "tran-quang-khai"],
    relatedEvents: ["dien-hong", "mongol-invasions"],
    relatedPlaces: ["thang-long", "yen-tu", "thien-truong"],
  },
  {
    id: "tran-quang-khai",
    name: "Trần Quang Khải",
    kind: "person",
    period: "1241 – 1294",
    summary:
      "Thượng tướng Thái sư, nhà ngoại giao và thi sĩ, người chỉ huy trận Chương Dương vang dội trong cuộc kháng chiến lần thứ hai.",
    x: 21,
    y: 66,
    relatedPeople: ["tran-hung-dao", "tran-nhan-tong"],
    relatedEvents: ["chuong-duong-1285", "mongol-invasions"],
    relatedPlaces: ["chuong-duong", "thang-long"],
  },
  {
    id: "tran-khanh-du",
    name: "Trần Khánh Dư",
    kind: "person",
    period: "1240 – 1340",
    summary:
      "Danh tướng nhà Trần trấn giữ vùng biển Đông Bắc, nổi bật với chiến thắng Vân Đồn khi đánh vào đoàn thuyền lương của Trương Văn Hổ.",
    x: 68,
    y: 63,
    relatedPeople: ["tran-hung-dao"],
    relatedEvents: ["van-don-1288", "bach-dang-1288"],
    relatedPlaces: ["van-don", "bach-dang-river"],
  },
  {
    id: "pham-ngu-lao",
    name: "Phạm Ngũ Lão",
    kind: "person",
    period: "1255 – 1320",
    summary:
      "Vị tướng xuất thân bình dân, tiêu biểu cho năng lực quân sự và tinh thần thượng võ của thời Trần, nhiều lần tham gia kháng chiến chống Nguyên.",
    x: 38,
    y: 67,
    relatedPeople: ["tran-hung-dao", "tran-nhan-tong"],
    relatedEvents: ["mongol-invasions"],
    relatedPlaces: ["van-kiep"],
  },
  {
    id: "yet-kieu",
    name: "Yết Kiêu",
    kind: "person",
    period: "thế kỷ XIII",
    summary:
      "Gia tướng của Trần Hưng Đạo, gắn với truyền thuyết bơi lặn tài tình và các hoạt động thủy chiến trong kháng chiến.",
    x: 56,
    y: 70,
    relatedPeople: ["tran-hung-dao"],
    relatedEvents: ["bach-dang-1288"],
    relatedPlaces: ["bach-dang-river"],
  },
  {
    id: "omar",
    name: "Ô Mã Nhi",
    kind: "person",
    period: "thế kỷ XIII",
    summary:
      "Tướng thủy quân Nguyên, chỉ huy cánh quân đường sông trong chiến dịch 1288 và bị bắt sau thất bại trên sông Bạch Đằng.",
    x: 83,
    y: 61,
    relatedPeople: ["thoat-hoan"],
    relatedEvents: ["bach-dang-1288", "mongol-invasions"],
    relatedPlaces: ["bach-dang-river"],
  },
  {
    id: "thoat-hoan",
    name: "Thoát Hoan",
    kind: "person",
    period: "thế kỷ XIII",
    summary:
      "Hoàng tử nhà Nguyên, tổng chỉ huy nhiều chiến dịch xâm lược Đại Việt nhưng liên tục gặp thế trận phòng thủ linh hoạt của nhà Trần.",
    x: 84,
    y: 39,
    relatedPeople: ["omar"],
    relatedEvents: ["mongol-invasions"],
    relatedPlaces: ["van-kiep", "thang-long"],
  },
  {
    id: "mongol-invasions",
    name: "Ba lần kháng chiến chống Nguyên Mông",
    kind: "event",
    period: "1258 · 1285 · 1288",
    summary:
      "Ba cuộc xâm lược của đế quốc Nguyên Mông hùng mạnh nhất thế giới đều bị quân dân nhà Trần đánh bại, khẳng định sức mạnh của tinh thần Đại Việt.",
    x: 59,
    y: 39,
    relatedPeople: ["tran-hung-dao", "tran-nhan-tong", "tran-quang-khai"],
    relatedEvents: ["bach-dang-1288", "chuong-duong-1285", "van-don-1288"],
    relatedPlaces: ["bach-dang-river", "thang-long", "van-kiep"],
  },
  {
    id: "bach-dang-1288",
    name: "Trận Bạch Đằng 1288",
    kind: "event",
    period: "Tháng 4 năm 1288",
    summary:
      "Trận thủy chiến lừng lẫy nơi Trần Hưng Đạo dùng kế cắm cọc gỗ trên sông, tiêu diệt toàn bộ đạo thủy quân Nguyên Mông do Ô Mã Nhi chỉ huy.",
    x: 72,
    y: 78,
    relatedPeople: ["tran-hung-dao", "tran-khanh-du", "yet-kieu", "omar"],
    relatedEvents: ["mongol-invasions", "van-don-1288"],
    relatedPlaces: ["bach-dang-river", "van-don"],
  },
  {
    id: "dien-hong",
    name: "Hội nghị Diên Hồng",
    kind: "event",
    period: "1284",
    summary:
      "Cuộc họp biểu tượng của tinh thần đồng thuận chống giặc, nơi các bô lão được hỏi kế sách trước nguy cơ xâm lược của quân Nguyên.",
    x: 26,
    y: 36,
    relatedPeople: ["tran-nhan-tong", "tran-hung-dao"],
    relatedEvents: ["mongol-invasions"],
    relatedPlaces: ["thang-long", "thien-truong"],
  },
  {
    id: "binh-than",
    name: "Hội nghị Bình Than",
    kind: "event",
    period: "1282",
    summary:
      "Cuộc bàn bạc quân sự trọng yếu của triều Trần, đặt nền cho việc phân công tướng lĩnh và chuẩn bị thế trận trước cuộc chiến lớn.",
    x: 42,
    y: 36,
    relatedPeople: ["tran-hung-dao", "tran-nhan-tong"],
    relatedEvents: ["mongol-invasions"],
    relatedPlaces: ["van-kiep"],
  },
  {
    id: "van-don-1288",
    name: "Trận Vân Đồn",
    kind: "event",
    period: "1288",
    summary:
      "Trận đánh vào đoàn thuyền lương của quân Nguyên, làm đứt nguồn tiếp vận và góp phần buộc đạo thủy quân địch rơi vào thế rút lui.",
    x: 76,
    y: 68,
    relatedPeople: ["tran-khanh-du"],
    relatedEvents: ["bach-dang-1288", "mongol-invasions"],
    relatedPlaces: ["van-don", "bach-dang-river"],
  },
  {
    id: "chuong-duong-1285",
    name: "Trận Chương Dương",
    kind: "event",
    period: "1285",
    summary:
      "Chiến thắng lớn trên bến Chương Dương, góp phần xoay chuyển cục diện kháng chiến lần thứ hai và mở đường giải phóng Thăng Long.",
    x: 18,
    y: 80,
    relatedPeople: ["tran-quang-khai"],
    relatedEvents: ["mongol-invasions"],
    relatedPlaces: ["chuong-duong", "thang-long"],
  },
  {
    id: "bach-dang-river",
    name: "Sông Bạch Đằng",
    kind: "place",
    period: "Quảng Ninh – Hải Phòng",
    summary:
      "Dòng sông lịch sử ba lần chứng kiến chiến thắng oanh liệt của dân tộc trước quân xâm lược phương Bắc, biểu tượng của trí tuệ quân sự Việt Nam.",
    x: 64,
    y: 88,
    relatedPeople: ["tran-hung-dao", "yet-kieu", "omar"],
    relatedEvents: ["bach-dang-1288"],
    relatedPlaces: ["van-don", "thang-long"],
  },
  {
    id: "thang-long",
    name: "Thăng Long",
    kind: "place",
    period: "Kinh đô Đại Việt",
    summary:
      "Kinh đô ngàn năm văn hiến, trung tâm chính trị và văn hóa của Đại Việt, nhiều lần được bỏ ngỏ làm kế 'vườn không nhà trống' trước giặc Nguyên.",
    x: 21,
    y: 49,
    relatedPeople: ["tran-nhan-tong", "tran-quang-khai", "thoat-hoan"],
    relatedEvents: ["dien-hong", "mongol-invasions", "chuong-duong-1285"],
    relatedPlaces: ["thien-truong", "chuong-duong", "bach-dang-river"],
  },
  {
    id: "van-kiep",
    name: "Vạn Kiếp",
    kind: "place",
    period: "Hải Dương",
    summary:
      "Căn cứ chiến lược gắn với Trần Hưng Đạo, nằm ở vị trí kiểm soát tuyến sông và đường tiến quân trọng yếu.",
    x: 50,
    y: 58,
    relatedPeople: ["tran-hung-dao", "pham-ngu-lao", "thoat-hoan"],
    relatedEvents: ["binh-than", "mongol-invasions"],
    relatedPlaces: ["thang-long", "bach-dang-river"],
  },
  {
    id: "van-don",
    name: "Vân Đồn",
    kind: "place",
    period: "Quảng Ninh",
    summary:
      "Thương cảng và vùng biển chiến lược ở Đông Bắc, nơi Trần Khánh Dư đánh vào đoàn thuyền lương của quân Nguyên.",
    x: 84,
    y: 79,
    relatedPeople: ["tran-khanh-du"],
    relatedEvents: ["van-don-1288", "bach-dang-1288"],
    relatedPlaces: ["bach-dang-river"],
  },
  {
    id: "thien-truong",
    name: "Thiên Trường",
    kind: "place",
    period: "Nam Định",
    summary:
      "Phủ Thiên Trường là vùng căn bản của hoàng tộc Trần, vừa là hậu phương chính trị vừa là biểu tượng của cội nguồn triều đại.",
    x: 35,
    y: 20,
    relatedPeople: ["tran-nhan-tong"],
    relatedEvents: ["dien-hong"],
    relatedPlaces: ["thang-long", "yen-tu"],
  },
  {
    id: "yen-tu",
    name: "Yên Tử",
    kind: "place",
    period: "Quảng Ninh",
    summary:
      "Không gian núi rừng gắn với Trần Nhân Tông sau chiến tranh, nơi hình thành Thiền phái Trúc Lâm và ký ức văn hóa thời Trần.",
    x: 43,
    y: 12,
    relatedPeople: ["tran-nhan-tong"],
    relatedEvents: [],
    relatedPlaces: ["thien-truong"],
  },
  {
    id: "chuong-duong",
    name: "Bến Chương Dương",
    kind: "place",
    period: "ven sông Hồng",
    summary:
      "Địa điểm diễn ra chiến thắng Chương Dương, nối với tuyến phòng thủ và phản công quanh Thăng Long trong năm 1285.",
    x: 14,
    y: 89,
    relatedPeople: ["tran-quang-khai"],
    relatedEvents: ["chuong-duong-1285"],
    relatedPlaces: ["thang-long"],
  },
]

export const graphEdges: GraphEdge[] = [
  { from: "tran-dynasty", to: "dai-viet-tran", label: "khung chính trị" },
  { from: "tran-dynasty", to: "tran-hung-dao", label: "tôn thất / thống lĩnh" },
  { from: "tran-dynasty", to: "tran-nhan-tong", label: "vua Trần" },
  { from: "tran-dynasty", to: "tran-quang-khai", label: "thượng tướng" },
  { from: "tran-dynasty", to: "tran-khanh-du", label: "danh tướng" },
  { from: "tran-dynasty", to: "dien-hong", label: "đồng thuận triều chính" },
  { from: "tran-dynasty", to: "thang-long", label: "kinh đô" },
  { from: "tran-dynasty", to: "thien-truong", label: "phủ căn bản" },
  { from: "dai-viet-tran", to: "mongol-invasions", label: "kháng chiến" },
  { from: "dai-viet-tran", to: "thang-long", label: "trung tâm" },
  { from: "dai-viet-tran", to: "yen-tu", label: "di sản văn hóa" },
  { from: "yuan-dynasty", to: "mongol-invasions", label: "mở chiến dịch" },
  { from: "yuan-dynasty", to: "thoat-hoan", label: "hoàng tử chỉ huy" },
  { from: "yuan-dynasty", to: "omar", label: "tướng thủy quân" },
  { from: "thoat-hoan", to: "mongol-invasions", label: "tổng chỉ huy" },
  { from: "thoat-hoan", to: "van-kiep", label: "hướng tiến quân" },
  { from: "omar", to: "bach-dang-1288", label: "cánh thủy binh" },
  { from: "omar", to: "bach-dang-river", label: "bị bắt sau trận" },
  { from: "tran-hung-dao", to: "mongol-invasions", label: "tiết chế quân đội" },
  { from: "tran-hung-dao", to: "bach-dang-1288", label: "thiết kế thế trận" },
  { from: "tran-hung-dao", to: "binh-than", label: "bàn kế sách" },
  { from: "tran-hung-dao", to: "van-kiep", label: "căn cứ" },
  { from: "tran-hung-dao", to: "pham-ngu-lao", label: "tướng dưới quyền" },
  { from: "tran-hung-dao", to: "yet-kieu", label: "gia tướng thủy chiến" },
  { from: "tran-nhan-tong", to: "dien-hong", label: "hiệu triệu" },
  { from: "tran-nhan-tong", to: "mongol-invasions", label: "lãnh đạo kháng chiến" },
  { from: "tran-nhan-tong", to: "yen-tu", label: "sau chiến tranh" },
  { from: "tran-nhan-tong", to: "thien-truong", label: "hoàng tộc" },
  { from: "tran-quang-khai", to: "chuong-duong-1285", label: "chỉ huy" },
  { from: "chuong-duong-1285", to: "chuong-duong", label: "địa điểm" },
  { from: "chuong-duong-1285", to: "thang-long", label: "mở đường giải phóng" },
  { from: "tran-khanh-du", to: "van-don-1288", label: "đánh thuyền lương" },
  { from: "van-don-1288", to: "van-don", label: "vùng biển" },
  { from: "van-don-1288", to: "bach-dang-1288", label: "cắt tiếp vận trước trận" },
  { from: "bach-dang-1288", to: "bach-dang-river", label: "chiến trường" },
  { from: "bach-dang-1288", to: "van-don", label: "tuyến rút lui" },
  { from: "bach-dang-1288", to: "yet-kieu", label: "truyền thống thủy chiến" },
  { from: "mongol-invasions", to: "bach-dang-1288", label: "đỉnh điểm 1288" },
  { from: "mongol-invasions", to: "chuong-duong-1285", label: "phản công 1285" },
  { from: "mongol-invasions", to: "van-kiep", label: "trục chiến lược" },
  { from: "thang-long", to: "chuong-duong", label: "tuyến sông Hồng" },
  { from: "thang-long", to: "bach-dang-river", label: "trục sông ra biển" },
  { from: "bach-dang-river", to: "van-don", label: "vùng Đông Bắc" },
]

export function getNode(id: string): GraphNode | undefined {
  return graphNodes.find((n) => n.id === id)
}

export interface ExplorationPath {
  id: string
  title: string
  subtitle: string
  count: string
  nodeIds: string[]
}

export const explorationPaths: ExplorationPath[] = [
  {
    id: "path-mongol",
    title: "Ba lần kháng Nguyên Mông",
    subtitle: "Hành trình của lòng quả cảm 1258 – 1288",
    count: "5 điểm dừng",
    nodeIds: ["mongol-invasions", "tran-nhan-tong", "tran-hung-dao", "thang-long", "bach-dang-1288"],
  },
  {
    id: "path-bachdang",
    title: "Trận Bạch Đằng",
    subtitle: "Bãi cọc gỗ và mưu lược thủy chiến",
    count: "3 điểm dừng",
    nodeIds: ["bach-dang-1288", "bach-dang-river", "tran-hung-dao"],
  },
  {
    id: "path-tran",
    title: "Triều đại nhà Trần",
    subtitle: "Hào khí Đông A và văn hóa Thiền học",
    count: "4 điểm dừng",
    nodeIds: ["tran-dynasty", "tran-nhan-tong", "tran-quang-khai", "thang-long"],
  },
  {
    id: "path-hungdao",
    title: "Hưng Đạo Đại Vương",
    subtitle: "Vị tướng huyền thoại của dân tộc",
    count: "4 điểm dừng",
    nodeIds: ["tran-hung-dao", "mongol-invasions", "bach-dang-1288", "bach-dang-river"],
  },
]

export interface TimelineStage {
  id: string
  year: string
  label: string
  description: string
}

export const battleTimeline: TimelineStage[] = [
  {
    id: "stage-1",
    year: "Đêm trước",
    label: "Cắm cọc trên sông",
    description:
      "Trần Hưng Đạo cho quân đẵn gỗ lim, đẽo nhọn bịt sắt và cắm xuống lòng sông Bạch Đằng tại các cửa hiểm, ngụy trang dưới mặt nước.",
  },
  {
    id: "stage-2",
    year: "Sáng sớm",
    label: "Nhử địch vào trận",
    description:
      "Thủy quân Đại Việt giả thua, dẫn dụ đoàn thuyền chiến của Ô Mã Nhi tiến sâu vào khúc sông khi thủy triều đang lên cao.",
  },
  {
    id: "stage-3",
    year: "Đỉnh điểm",
    label: "Thủy triều rút",
    description:
      "Nước rút mạnh, hàng nghìn cọc nhọn nhô lên xuyên thủng thuyền giặc. Đại quân ta từ hai bên bờ và thượng nguồn đổ ra tổng công kích.",
  },
  {
    id: "stage-4",
    year: "Toàn thắng",
    label: "Tiêu diệt thủy binh",
    description:
      "Toàn bộ đạo thủy quân Nguyên Mông bị tiêu diệt, Ô Mã Nhi bị bắt sống. Chiến thắng khép lại cuộc kháng chiến lần thứ ba.",
  },
]

export interface Hotspot {
  id: string
  stageId: string
  x: number
  y: number
  title: string
  detail: string
}

export const battleHotspots: Hotspot[] = [
  {
    id: "hs-stakes",
    stageId: "stage-1",
    x: 32,
    y: 70,
    title: "Bãi cọc Bạch Đằng",
    detail: "Hàng nghìn cọc gỗ lim bịt sắt được đóng xuống lòng sông, ẩn mình chờ thủy triều.",
  },
  {
    id: "hs-fleet",
    stageId: "stage-2",
    x: 60,
    y: 46,
    title: "Đoàn thuyền Nguyên Mông",
    detail: "Đạo thủy quân của Ô Mã Nhi bị nhử tiến sâu vào khúc sông mai phục.",
  },
  {
    id: "hs-command",
    stageId: "stage-3",
    x: 74,
    y: 30,
    title: "Sở chỉ huy Trần Hưng Đạo",
    detail: "Từ điểm cao, Quốc công Tiết chế ra lệnh tổng phản công khi nước triều bắt đầu rút.",
  },
  {
    id: "hs-ambush",
    stageId: "stage-4",
    x: 46,
    y: 24,
    title: "Phục binh hai bờ",
    detail: "Bộ binh và voi chiến mai phục đổ ra chặn đường rút lui của quân giặc.",
  },
]
