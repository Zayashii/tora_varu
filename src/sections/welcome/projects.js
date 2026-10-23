// hooks
import { useResponsive } from "src/hooks/use-responsive";
import { COLORS } from "src/layouts/config-layout";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

const MOBILE_TIMELINE = [
  {
    year: "2016",
    description:
      "“Бичил Глобус” компанид “Grape City” копманийн зээлийн core программ нэвтрүүлэх ажлыг хийж гүйцэтгэсэн.",
    logos: ["/assets/completed-projects/grape-city.svg"],
  },
  {
    year: "2017",
    description:
      "Групп копманийн бизнес процесс зураглал. Түүнд тохирох ERP программын судалгаа хөгжүүлэлтийн төлөвлөгөө.",
    logos: ["/assets/completed-projects/bichil.svg"],
  },
  {
    year: "2018",
    description:
      "Соно Финтек системийн төслийг санаачилж үүсгэн байгуулсан. Төслийн судалгаа шаардлага боловсруулж төлөвлөгөө бүрэн гарсан.",
    logos: ["/assets/completed-projects/sono.svg"],
  },
  {
    year: "2019",
    description: "2019 оны 6-р сарын 19-ны өдөр АПП-ийн зах зээлд нэвтрүүлсэн.",
    logos: ["/assets/completed-projects/sono2.svg"],
  },
  {
    year: "2020",
    description:
      "“Жи Эс Пи ББСБ” финтек систем нэвтрүүлэх төлсийг хийж гүйцэтгэсэн. Зээлийн core систем болон зээлийн АПП нэвтрүүлсэн.",
    logos: ["/assets/completed-projects/gsb.svg"],
  },
  {
    year: "2021",
    description:
      "М кредит Зээлийн АПП нэвтрүүлэх төлсийг эхлүүлж программ хөгжүүлэлтийн ажил эхлүүлсэн.",
    logos: [],
  },
  {
    year: "2022",
    description:
      "“АПУ” ХК-ийн охин копмани болох “СББ Трэйд” ХХК-нд, АПУ трэйд ХХК, АПУ Дэйри ХХК гэсэн гурван копманд Ultimate ERP системийг өөрчилж хөгжүүлэн нэвтрүүлсэн.",
    logos: [
      "/assets/completed-projects/apu.svg",
      "/assets/completed-projects/ultimate-erp.svg",
      "/assets/completed-projects/talh-chiher.svg",
    ],
  },
  {
    year: "2023",
    description:
      "Талх Чихэр ХК-д Ultimate ERP системийг өөрчилж хөгжүүлэн нэвтрүүлсэн.",
    logos: [
      "/assets/completed-projects/khurgan.svg",
      "/assets/completed-projects/mcommerce2.svg",
    ],
  },
  {
    year: "2024",
    description:
      "Мерчант Коммерси ХХК үүсгэн байгуулж төслийн багийн 100% бие дааж хэрэгжүүлж буй төслийг эхлүүлсэн",
    logos: [],
  },
  {
    year: "2025",
    description:
      "Жижиг санхүүгийн салбарт зориулсан үнэгүй систем нэвтрүүлсэн. www.khurganzeel.mn",
    logos: ["/assets/completed-projects/khurgan.svg"],
  },
];

export default function Projects({ experienceRef }) {
  const mdUp = useResponsive("up", "md");
  const smUp = useResponsive("up", "sm");
  const lgUp = useResponsive("up", "lg");
  const xlUp = useResponsive("up", "xl");

  const timelineYearFont = lgUp ? "clamp(24px, 2vw, 30px)" : "24px";
  const timelineBodyFont = lgUp ? "clamp(10px, 0.9vw, 12px)" : "11px";
  const timelineNarrowTextWidth = lgUp ? "46%" : "68%";
  const timelineWideTextWidth = lgUp ? "74%" : "90%";

  return (
    <div
      id="module-container"
      style={{
        height: "100%",
        minHeight: "120vh",
        position: "relative",
      }}
      ref={experienceRef}
    >
      <div style={{ height: "100%" }}>
        <div
          id="services-section"
          style={{
            paddingTop: "60px",
            paddingBottom: "20px",
            paddingLeft: lgUp ? "120px" : smUp ? "40px" : "16px",
            paddingRight: lgUp ? "120px" : smUp ? "40px" : "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: lgUp ? "row" : "column",
              alignItems: lgUp ? "center" : "flex-start",
              justifyContent: lgUp ? "space-between" : "flex-start",
              gap: lgUp ? "20px" : "12px",
              textAlign: "left",
              width: "100%",
              position: "relative",
            }}
          >
            <div style={{ maxWidth: "100%", textAlign: "left", width: "100%" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: lgUp
                    ? "clamp(36px, 3.6vw, 48px)"
                    : mdUp
                    ? "clamp(30px, 4.4vw, 40px)"
                    : smUp
                    ? "32px"
                    : "24px",
                  fontWeight: 800,
                  color: "#111827",
                  lineHeight: 1.1,
                }}
              >
                ГҮЙЦЭТГЭСЭН ТӨСЛИЙН ЦАГ ХУГАЦААНЫ ЗУРАГЛАЛ
              </p>
            </div>

            <div
              style={{
                position: xlUp ? "absolute" : "relative",
                top: xlUp ? 80 : "auto",
                width: "100%",
                marginTop: xlUp ? 0 : "16px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "lighter",
                  width: xlUp ? "22%" : "100%",
                  textAlign: "start",
                  margin: 0,
                }}
              >
                Өнгөрсөн 10 жилийн хугацаанд манай ББСБ-ийн салбар болон
                Үйлдвэрлэгч худалдааны компанид ERP систем нэвтрүүлэх чиглэлээр
                түлхүү ажиллаж туршлага хуримтлуулсан. Бидний хийж гүйцэтгэсэн
                ажлын туршлагын талаар уулзалт товлон дэлгэрэнгүй мэдээлэл авах
                боломжтой.
              </p>
            </div>

            <div
              style={{
                position: xlUp ? "absolute" : "relative",
                right: xlUp ? 120 : "auto",
                top: xlUp ? 100 : "auto",
                marginTop: xlUp ? 0 : "20px",
                alignSelf: xlUp ? "auto" : "flex-start",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: COLORS.ButtonColor,
                  color: "black",
                  alignSelf: "center",
                  height: "40px",
                  borderRadius: "0px",
                  border: "2px solid black",
                  fontSize: "13px",
                  fontWeight: 300,
                  "&:hover": {
                    backgroundColor: COLORS.ButtonColor,
                    opacity: 0.5,
                    boxShadow: "4px 4px 0 black",
                  },
                  boxShadow: "4px 4px 0 black",
                  "&:active": { boxShadow: "4px 4px 0 black" },
                }}
              >
                Дэлгэрэнгүй...
              </Button>
            </div>
          </div>

          <div style={{ height: lgUp ? "80px" : "32px" }} />

          {mdUp ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "auto",
                flexDirection: mdUp ? "row" : "column",
                gap: mdUp ? 0 : "40px",
              }}
            >
              <div style={{ flexBasis: mdUp ? "60%" : "100%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: mdUp ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: mdUp ? "auto" : "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: mdUp ? "flex-end" : "flex-start",
                          alignItems: mdUp ? "end" : "flex-start",
                          marginBottom: mdUp ? 0 : "20px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: timelineYearFont,
                            fontWeight: "bold",
                          }}
                        >
                          2018
                        </p>
                        <p
                          style={{
                            fontSize: timelineBodyFont,
                            fontWeight: "lighter",
                            width: timelineNarrowTextWidth,
                            textAlign: mdUp ? "end" : "start",
                          }}
                        >
                          Соно Финтек системийн төслийг санаачилж үүсгэн
                          байгуулсан. Төслийн судалгаа шаардлага боловсруулж
                          төлөвлөгөө бүрэн гарсан.
                        </p>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: mdUp ? "row" : "column-reverse",
                          justifyContent: mdUp ? "flex-end" : "flex-start",
                          alignItems: mdUp ? "center" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: mdUp ? "flex-end" : "flex-start",
                          }}
                        >
                          <p
                            style={{
                              fontSize: timelineYearFont,
                              fontWeight: "bold",
                            }}
                          >
                            2017
                          </p>
                          <p
                            style={{
                              fontSize: timelineBodyFont,
                              fontWeight: "lighter",
                              width: timelineNarrowTextWidth,
                              textAlign: mdUp ? "end" : "start",
                            }}
                          >
                            Групп копманийн бизнес процесс зураглал. Түүнд
                            тохирох ERP программын судалгаа хөгжүүлэлтийн
                            төлөвлөгөө.
                          </p>
                        </div>

                        <div style={{ width: "20px", height: "10px" }} />

                        <Box
                          component="img"
                          src="/assets/completed-projects/bichil.svg"
                          alt="Bichil"
                          sx={{
                            width: mdUp ? "auto" : "100px",
                            maxWidth: "100%",
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ width: "20px" }} />

                    <Box
                      component="img"
                      src="/assets/completed-projects/sono.svg"
                      alt="Sono"
                      sx={{
                        height: "100%",
                        display: mdUp ? "block" : "none",
                      }}
                    />
                  </div>

                  <div style={{ height: "20px" }} />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: mdUp ? "row" : "column",
                      alignItems: mdUp ? "start" : "flex-start",
                      gap: mdUp ? 0 : "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: mdUp ? "end" : "flex-start",
                      }}
                    >
                      <p
                        style={{
                          fontSize: timelineYearFont,
                          fontWeight: "bold",
                        }}
                      >
                        2016
                      </p>
                      <p
                        style={{
                          fontSize: timelineBodyFont,
                          fontWeight: "lighter",
                          width: timelineNarrowTextWidth,
                          textAlign: mdUp ? "end" : "start",
                        }}
                      >
                        “Бичил Глобус” компанид “Grape City” копманийн зээлийн
                        core программ нэвтрүүлэх ажлыг хийж гүйцэтгэсэн.
                      </p>
                    </div>

                    <div style={{ width: "20px" }} />

                    <Box
                      component="img"
                      src="/assets/completed-projects/grape-city.svg"
                      alt="Grape City"
                      sx={{
                        height: "100%",
                        maxWidth: mdUp ? "auto" : "100px",
                        alignSelf: mdUp ? "auto" : "flex-start",
                      }}
                    />

                    <div style={{ width: "20px" }} />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: mdUp ? "20%" : "100%",
                      }}
                    >
                      <Box
                        component="img"
                        src="/assets/completed-projects/sono2.svg"
                        alt="Sono 2"
                        sx={{
                          display: "block",
                          height: "auto",
                          maxWidth: mdUp ? "100%" : "60px",
                        }}
                      />

                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <p
                          style={{
                            fontSize: timelineYearFont,
                            fontWeight: "bold",
                            margin: 0,
                          }}
                        >
                          2019
                        </p>
                        <p
                          style={{
                            fontSize: timelineBodyFont,
                            fontWeight: "lighter",
                            textAlign: "start",
                            margin: 0,
                          }}
                        >
                          2019 оны 6-р сарын 19-ны өдөр АПП-ийн зах зээлд
                          нэвтрүүлсэн.
                        </p>
                      </div>
                    </div>

                    <div style={{ width: "20px" }} />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: mdUp ? "30%" : "100%",
                      }}
                    >
                      <Box
                        component="img"
                        src="/assets/completed-projects/gsb.svg"
                        alt="GSB"
                        sx={{
                          display: "block",
                          width: mdUp ? "100%" : "120px",
                          height: "auto",
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <p
                          style={{
                            fontSize: timelineYearFont,
                            fontWeight: "bold",
                            margin: 0,
                          }}
                        >
                          2020
                        </p>
                        <p
                          style={{
                            fontSize: timelineBodyFont,
                            fontWeight: "lighter",
                            textAlign: "start",
                            margin: 0,
                          }}
                        >
                          “Жи Эс Пи ББСБ” финтек систем нэвтрүүлэх төлсийг хийж
                          гүйцэтгэсэн. Зээлийн core систем болон зээлийн АПП
                          нэвтрүүлсэн.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ width: "20px" }} />

              <div style={{ flexBasis: mdUp ? "40%" : "100%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "start",
                    }}
                  >
                    <p
                      style={{
                        fontSize: timelineYearFont,
                        fontWeight: "bold",
                      }}
                    >
                      2021
                    </p>
                    <p
                      style={{
                        fontSize: timelineBodyFont,
                        fontWeight: "lighter",
                        width: timelineNarrowTextWidth,
                        textAlign: "start",
                      }}
                    >
                      М кредит Зээлийн АПП нэвтрүүлэх төлсийг эхлүүлж программ
                      хөгжүүлэлтийн ажил эхлүүлсэн.
                    </p>
                  </div>
                  <div style={{ height: "20px" }} />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/completed-projects/apu.svg"
                      alt="APU"
                      sx={{
                        display: "block",
                        height: "auto",
                        maxWidth: mdUp ? "100%" : "80px",
                      }}
                    />

                    <div style={{ width: "20px" }} />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "start",
                      }}
                    >
                      <p
                        style={{
                          fontSize: timelineYearFont,
                          fontWeight: "bold",
                        }}
                      >
                        2022
                      </p>
                      <p
                        style={{
                          fontSize: timelineBodyFont,
                          fontWeight: "lighter",
                          width: timelineWideTextWidth,
                          textAlign: "start",
                        }}
                      >
                        “АПУ” ХК-ийн охин копмани болох “СББ Трэйд” ХХК-нд, АПУ
                        трэйд ХХК, АПУ Дэйри ХХК гэсэн гурван копманд Ultimate
                        ERP системийг өөрчилж хөгжүүлэн нэвтрүүлсэн.
                      </p>
                    </div>
                  </div>

                  <div style={{ height: "20px" }} />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: mdUp ? "nowrap" : "wrap",
                      gap: "20px",
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/completed-projects/ultimate-erp.svg"
                      alt="Ultimate ERP"
                      sx={{ display: "block", height: mdUp ? "100%" : "40px" }}
                    />

                    <Box
                      component="img"
                      src="/assets/completed-projects/talh-chiher.svg"
                      alt="Talh Chiher"
                      sx={{ display: "block", height: mdUp ? "100%" : "40px" }}
                    />
                  </div>

                  <div style={{ height: "20px" }} />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: mdUp ? "nowrap" : "wrap",
                      gap: mdUp ? 0 : "20px",
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/completed-projects/khurgan.svg"
                      alt="Khurgan"
                      sx={{ display: "block", height: mdUp ? "100%" : "40px" }}
                    />

                    <div style={{ width: mdUp ? "20px" : "0px" }} />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          gap: 16,
                        }}
                      >
                        <Box
                          component="img"
                          src="/assets/completed-projects/mcommerce2.svg"
                          alt="M Commerce"
                          sx={{
                            display: "block",
                            height: mdUp ? "100%" : "40px",
                          }}
                        />

                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <p
                            style={{
                              fontSize: timelineYearFont,
                              fontWeight: "bold",
                              margin: 0,
                            }}
                          >
                            2023
                          </p>
                          <p
                            style={{
                              fontSize: timelineBodyFont,
                              fontWeight: 300,
                              width: timelineWideTextWidth,
                              textAlign: "left",
                              margin: 0,
                            }}
                          >
                            Талх Чихэр ХК-д Ultimate ERP системийг өөрчилж
                            хөгжүүлэн нэвтрүүлсэн.
                          </p>
                        </div>
                      </div>
                      <div style={{ height: "20px" }} />

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          alignItems: "start",
                        }}
                      >
                        <p
                          style={{
                            fontSize: timelineYearFont,
                            fontWeight: "bold",
                          }}
                        >
                          2024
                        </p>
                        <p
                          style={{
                            fontSize: timelineBodyFont,
                            fontWeight: "lighter",
                            width: timelineWideTextWidth,
                            textAlign: "start",
                          }}
                        >
                          Мерчант Коммерси ХХК үүсгэн байгуулж төслийн багийн
                          100% бие дааж хэрэгжүүлж буй төслийг эхлүүлсэн
                        </p>
                      </div>
                      <div style={{ height: "20px" }} />

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          alignItems: "start",
                        }}
                      >
                        <p
                          style={{
                            fontSize: timelineYearFont,
                            fontWeight: "bold",
                          }}
                        >
                          2025
                        </p>
                        <p
                          style={{
                            fontSize: timelineBodyFont,
                            fontWeight: "lighter",
                            width: timelineWideTextWidth,
                            textAlign: "start",
                          }}
                        >
                          Жижиг санхүүгийн салбарт зориулсан үнэгүй систем
                          нэвтрүүлсэн. www.khurganzeel.mn
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: smUp ? "16px" : "12px",
              }}
            >
              {MOBILE_TIMELINE.map((item) => (
                <div
                  key={item.year}
                  style={{
                    border: "2px solid #111827",
                    boxShadow: "4px 4px 0 #111827",
                    padding: smUp ? "18px" : "14px",
                    backgroundColor: "#fff",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: smUp ? "34px" : "28px",
                      fontWeight: 800,
                      lineHeight: 1,
                      color: "#111827",
                    }}
                  >
                    {item.year}
                  </p>

                  <p
                    style={{
                      margin: "10px 0 0",
                      fontSize: smUp ? "14px" : "13px",
                      lineHeight: 1.6,
                      fontWeight: 300,
                      color: "#111827",
                    }}
                  >
                    {item.description}
                  </p>

                  {item.logos.length > 0 && (
                    <div
                      style={{
                        marginTop: "14px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      {item.logos.map((src) => (
                        <Box
                          key={`${item.year}-${src}`}
                          component="img"
                          src={src}
                          alt={`${item.year} logo`}
                          sx={{
                            maxHeight: 44,
                            width: "auto",
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ height: "50px" }} />

      <div style={{ height: "20px" }} />
    </div>
  );
}
