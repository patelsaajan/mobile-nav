//@ts-ignore
import {
    addPropertyControls,
    ControlType,
    useRouter,
    RenderTarget,
} from "framer"
import { Menu, X, Mail, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigation } from "framer"
import { useState, useRef, useEffect } from "react"
import ReactDOM from "react-dom"

function isValidRoute(result: RouterResult | null): result is RouterResult {
    return (
        result !== null &&
        typeof result.routeId === "string" &&
        typeof result.params === "object"
    )
}

function parseRoute(
    routes,
    targetPath
): { routeId: string; params: Record<string, string> } | null {
    for (const [routeId, routeInfo] of Object.entries(routes)) {
        const pattern = routeInfo.path
        if (!pattern) continue

        const paramNames: string[] = []
        const regexPattern = pattern.replace(/:(\w+)/g, (_, paramName) => {
            paramNames.push(paramName)
            return "([^/]+)"
        })

        const regex = new RegExp(`^${regexPattern}$`)
        const match = targetPath.match(regex)

        if (match) {
            const params = paramNames.reduce(
                (acc, name, index) => ({
                    ...acc,
                    [name]: match[index + 1],
                }),
                {}
            )

            return { routeId, params }
        }
    }
    return null
}

const navigateToPath = (router, path: string) => {
    const { navigate, routes } = router
    const result = parseRoute(routes, path)

    if (!result) {
        console.warn(`Navigation failed: No matching route for ${path}`)
        return false
    }

    try {
        navigate(result.routeId, "", result.params)
        return true
    } catch (error) {
        console.error(`Navigation error:`, error)
        return false
    }
}

export default function MobileNav(props: any) {
    const [isOpen, setIsOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const navRef = useRef<HTMLDivElement>(null)
    const [navRect, setNavRect] = useState({ bottom: 0, left: 0, width: 0 })

    const currentPath: string =
        typeof window !== "undefined" ? window.location.pathname : ""

    const siteNameVal: string = props.siteName || "Site Name"
    const titleCol: string = props.titleColor || "#000000"
    const accentCol: string = props.accentColor || "#280D72"
    const bgCol: string = props.backgroundColor || "#ffffff"
    const textCol: string = props.textColor || "#666666"
    const mutedCol: string = props.mutedColor || "#888888"
    const activeIndex: number = props.activeIndex || 0

    const navLinks: { label: string; url: string }[] = props.navItems || []
    const contactSectionLabel: string = props.contactLabel || ""
    const contactEmailAddr: string = props.contactEmail || ""
    const contactPhoneNum: string = props.contactPhone || ""
    const ctaButtonLabel: string = props.ctaLabel || ""
    const ctaButtonUrl: string = props.ctaUrl || "#"

    const currentIndex = hoveredIndex !== null ? hoveredIndex : activeIndex
    const [bulletReady, setBulletReady] = useState(false)
    const bulletDelay: number = 0.25 + (navLinks.length - 1) * 0.05 + 0.15

    const navigation = useNavigation()
    const router = useRouter()

    const [isTablet, setIsTablet] = useState(
        typeof window !== "undefined" ? window.innerWidth > 600 : false
    )

    useEffect(() => {
        const handleResize = () => setIsTablet(window.innerWidth > 600)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const handleClick = (e, link) => {
        e.preventDefault()
        const result = parseRoute(router.routes, link)
        if (result) {
            handleToggle()
            setTimeout(() => {
                router.navigate(result.routeId, "", result.params)
            }, 400)
        } else {
            console.warn(`Navigation failed: No matching route for ${link}`)
        }
    }

    const handleToggle = () => {
        if (isClosing) return
        if (isOpen) {
            setIsClosing(true)
            setIsOpen(false)
            setBulletReady(false)
            setTimeout(() => setIsClosing(false), 750)
        } else {
            setIsOpen(true)
        }
    }

    const updateRect = () => {
        if (navRef.current) {
            const rect = navRef.current.getBoundingClientRect()
            setNavRect({
                bottom: rect.bottom,
                left: rect.left,
                width: rect.width,
            })
        }
    }

    useEffect(() => {
        updateRect()
        window.addEventListener("resize", updateRect)
        return () => window.removeEventListener("resize", updateRect)
    }, [])

    useEffect(() => {
        updateRect()
    }, [isOpen])

    if (typeof document === "undefined") return null

    const overlayVariants = {
        hidden: {
            y: "-100%",
            transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
        },
        visible: {
            y: 0,
            transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut",
                delay: 0.25 + i * 0.05,
            },
        }),
        exit: (i: number) => ({
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.15,
                ease: "easeIn",
                delay: i * 0.02,
            },
        }),
    }

    const modalContent = (
        <div
            style={{
                position: "fixed",
                top: navRect.bottom,
                left: navRect.left,
                width: navRect.width,
                bottom: 0,
                zIndex: 9999,
                pointerEvents: isOpen ? "auto" : "none",
                overflow: "hidden",
            }}
        >
            <style>{`
                .nav-items {
                    display: flex;
                    flex-direction: column;
                    
                }
                .mn-nav-link {
                    color: ${mutedCol};
                    text-decoration: none;
                    font-size: 24px;
                    font-weight: 500;
                    display: block;
                    transform-origin: left center;
                    width: 100%;
                    padding: 12px 0px;
                    line-height: 0.8rem;
                }
                .mn-contact-link {
                    display: flex;
                    gap: 8px;
                    align-content: center;
                    color: ${mutedCol};
                    text-decoration: none;
                    transition: color 0.2s;
                    font-size: 14px;
                }
                .mn-contact-link:hover { color: ${accentCol}; }
                .mn-cta {
                    display: block;
                    width: 100%;
                    max-width: ${isTablet ? "250px" : "100%"};
                    background: ${accentCol};
                    color: white;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    padding: 18px;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 8px;
                    box-sizing: border-box;
                    transition: opacity 0.2s;
                }
                .mn-cta:hover { opacity: 0.85; }

                .nav-footer {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .overlay-content {
                    display: flex;
                    flex-direction: row;
                    gap: 100px;

                }

                .overlay-content.is-compact {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
            `}</style>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleToggle}
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(0,0,0,0.4)",
                                zIndex: -1,
                            }}
                        />
                        <motion.div
                            key="overlay"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={overlayVariants}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                background: bgCol,
                                display: "flex",
                                flexDirection: "column",
                                padding: "0px 16px 16px",
                                fontFamily: "sans-serif",
                                overflowY: "auto",
                                overflowX: "hidden",
                            }}
                        >
                            <div
                                className={
                                    "overlay-content " +
                                    (!isTablet ? "is-compact" : "")
                                }
                            >
                                <div className="nav-items">
                                    {navLinks.map((link, index) => {
                                        const isActive =
                                            currentPath === link.url ||
                                            index === activeIndex

                                        return (
                                            <motion.div
                                                key={index}
                                                custom={index}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 16,
                                                }}
                                                onMouseEnter={() =>
                                                    setHoveredIndex(index)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredIndex(null)
                                                }
                                            >
                                                <div
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        position: "relative",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <AnimatePresence>
                                                        {index ===
                                                            currentIndex && (
                                                            <motion.span
                                                                layoutId="activeBullet"
                                                                initial={{
                                                                    opacity: 0,
                                                                    x: bulletReady
                                                                        ? 0
                                                                        : -navRect.left -
                                                                          32,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    x: 0,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    transition:
                                                                        {
                                                                            duration: 0.1,
                                                                        },
                                                                }}
                                                                transition={
                                                                    bulletReady
                                                                        ? {
                                                                              type: "spring",
                                                                              stiffness: 500,
                                                                              damping: 30,
                                                                          }
                                                                        : {
                                                                              opacity:
                                                                                  {
                                                                                      delay: bulletDelay,
                                                                                      duration: 0.2,
                                                                                  },
                                                                              x: {
                                                                                  delay: bulletDelay,
                                                                                  duration: 0.2,
                                                                                  ease: "easeIn",
                                                                              },
                                                                          }
                                                                }
                                                                onAnimationComplete={() =>
                                                                    setBulletReady(
                                                                        true
                                                                    )
                                                                }
                                                                style={{
                                                                    position:
                                                                        "absolute",
                                                                    inset: 0,
                                                                    width: "80%",
                                                                    height: "80%",
                                                                    borderRadius: 4,
                                                                    background:
                                                                        accentCol,
                                                                }}
                                                            />
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                <motion.a
                                                    href={link.url}
                                                    onClick={(e) =>
                                                        handleClick(e, link.url)
                                                    }
                                                    className="mn-nav-link"
                                                    animate={{
                                                        color:
                                                            index ===
                                                                currentIndex ||
                                                            index ===
                                                                activeIndex
                                                                ? accentCol
                                                                : mutedCol,
                                                        scale:
                                                            index ===
                                                            currentIndex
                                                                ? 1.05
                                                                : 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.15,
                                                    }}
                                                >
                                                    {link.label}
                                                </motion.a>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                                <motion.div
                                    className="nav-footer"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeOut",
                                        delay: bulletDelay + 0.2,
                                    }}
                                >
                                    {(contactSectionLabel !== "" ||
                                        contactEmailAddr !== "" ||
                                        contactPhoneNum !== "") && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 8,
                                            }}
                                        >
                                            {contactSectionLabel !== "" && (
                                                <div
                                                    style={{
                                                        color: accentCol,
                                                        textTransform:
                                                            "uppercase",
                                                        letterSpacing: 2,
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    {contactSectionLabel}
                                                </div>
                                            )}
                                            {contactEmailAddr !== "" && (
                                                <div>
                                                    <a
                                                        href={
                                                            "mailto:" +
                                                            contactEmailAddr
                                                        }
                                                        className="mn-contact-link"
                                                    >
                                                        <Mail size={20} />
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            {contactEmailAddr}
                                                        </p>
                                                    </a>
                                                </div>
                                            )}
                                            {contactPhoneNum !== "" && (
                                                <div>
                                                    <a
                                                        href={
                                                            "tel:" +
                                                            contactPhoneNum
                                                        }
                                                        className="mn-contact-link"
                                                    >
                                                        <Phone size={20} />
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                            }}
                                                        >
                                                            {contactPhoneNum}
                                                        </p>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {ctaButtonLabel !== "" && (
                                        <a
                                            href={ctaButtonUrl}
                                            className="mn-cta"
                                        >
                                            {ctaButtonLabel}
                                        </a>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )

    return (
        <div ref={navRef} style={{ fontFamily: "sans-serif", width: "100%" }}>
            <style>{`
                .mn-site-name {
                    color: ${titleCol};
                    font-weight: 900;
                    font-size: 18px;
                    margin: 0;
                    padding: 0;
                    text-decoration: none;
                }
                .mn-icon-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    transition: background 0.2s;
                }
                .mn-icon-btn:hover { background: rgba(128,128,128,0.15); }
            `}</style>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: bgCol,
                    padding: "12px 16px",
                    width: "100%",
                    minWidth: 250,
                    height: "fit-content",
                    boxSizing: "border-box",
                }}
            >
                <a href="/" className="mn-site-name">
                    {siteNameVal}
                </a>
                <motion.button
                    className="mn-icon-btn"
                    onClick={handleToggle}
                    animate={{ opacity: isClosing ? 0.4 : 1 }}
                    style={{ pointerEvents: isClosing ? "none" : "auto" }}
                    whileTap={{ scale: 0.9 }}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.span
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <X size={20} color={mutedCol} />
                            </motion.span>
                        ) : (
                            <motion.span
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Menu size={20} color={mutedCol} />
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {ReactDOM.createPortal(modalContent, document.body)}
        </div>
    )
}

addPropertyControls(MobileNav, {
    siteName: {
        title: "Site Name",
        type: ControlType.String,
        defaultValue: "Site Name",
    },
    navItems: {
        title: "Nav Items",
        type: ControlType.Array,
        control: {
            type: ControlType.Object,
            controls: {
                label: {
                    title: "Label",
                    type: ControlType.String,
                    defaultValue: "Link",
                },
                url: {
                    title: "URL",
                    type: ControlType.Link,
                },
            },
        },
        defaultValue: [
            { label: "Home", url: "./" },
            { label: "About", url: "./about" },
            { label: "Pricing", url: "./pricing" },
            { label: "Work", url: "./work" },
            { label: "Contact", url: "./contact" },
        ],
    },
    activeIndex: {
        title: "Active Item",
        type: ControlType.Number,
        defaultValue: 0,
        min: 0,
        step: 1,
    },
    contactLabel: {
        title: "Contact Label",
        type: ControlType.String,
        defaultValue: "Contact",
    },
    contactEmail: {
        title: "Email",
        type: ControlType.String,
        defaultValue: "contact@example.com",
    },
    contactPhone: {
        title: "Phone",
        type: ControlType.String,
        defaultValue: "",
    },
    ctaLabel: {
        title: "CTA Label",
        type: ControlType.String,
        defaultValue: "Book Now",
    },
    ctaUrl: {
        title: "CTA URL",
        type: ControlType.String,
        defaultValue: "#",
    },
    titleColor: {
        title: "Title",
        type: ControlType.Color,
        defaultValue: "#000000",
    },
    accentColor: {
        title: "Accent",
        type: ControlType.Color,
        defaultValue: "#280D72",
    },
    backgroundColor: {
        title: "Background",
        type: ControlType.Color,
        defaultValue: "#ffffff",
    },
    textColor: {
        title: "Nav Text",
        type: ControlType.Color,
        defaultValue: "#666666",
    },
    mutedColor: {
        title: "Muted Text",
        type: ControlType.Color,
        defaultValue: "#888888",
    },
})
