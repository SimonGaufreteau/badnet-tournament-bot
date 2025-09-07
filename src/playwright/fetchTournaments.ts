import { chromium } from "playwright"

interface ScrapeTournament {
  id: number
  name: string
  location: string
  date: string
  category: string
  rankings: string[]
  url: string
  inscriptionClose: string
  inscriptionOpen: string
}

export const scrapeBadnet = async () => {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  try {
    await page.goto("https://badnet.fr/")
    await page.getByText("Liste menu", { exact: true }).click()
    await page.getByRole("textbox", { name: "Toutes les régions" }).click()
    await page.getByRole("searchbox").fill("ile")
    await page.getByRole("option", { name: "Ile de France" }).click()
    // NOTE : already open tournaments
    // await page
    //   .locator(".group.separator > div:nth-child(2) > .flex > div > label")
    //   .first()
    //   .click()
    await page
      .locator(
        ".group.separator > div:nth-child(2) > .flex > div:nth-child(2) > label",
      )
      .click()
    // TODO : How long do we wait ? Maybe put a loop to make sure the tournaments inside the results have changed instead
    await page.waitForTimeout(5000)

    const data: ScrapeTournament[] = await page
      .locator("#search_results .b-row .row")
      .evaluateAll((items) =>
        items.map((item) => {
          const limitElement = item.querySelector(".limit")
          const limitText = limitElement?.textContent?.trim() || ""
          const openInMatch = limitText.match(/dans (\d+ jours?)/)
          return {
            id:
              Number.parseInt(item.getAttribute("id")?.replace("event-", "")) ||
              0,
            name: item.querySelector(".name")?.textContent?.trim() || "",
            location:
              item.querySelector(".location")?.textContent?.trim() || "",
            date: item.querySelector(".date")?.textContent?.trim() || "",
            category: item.querySelector(".cat")?.textContent?.trim() || "",
            rankings:
              item.querySelector(".clt")?.textContent?.trim().split(", ") || [],
            url: "https://badnet.fr" + item.getAttribute("href") || "",
            inscriptionClose:
              limitElement
                ?.getAttribute("title")
                ?.replace("Inscr. av. le ", "") || "",
            inscriptionOpen: openInMatch ? openInMatch[1] : "",
          }
        }),
      )
    console.log(data)
    return data
  } finally {
    await browser.close()
  }
}
