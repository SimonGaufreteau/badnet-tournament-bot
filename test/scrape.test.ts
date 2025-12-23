import { scrapeBadnet } from "../src/playwright/fetchTournaments"

describe("scrape badnet", () => {
  it.skip("should scrape the tournaments for IDF ", async () => {
    const result = await scrapeBadnet()
    expect(result).toEqual({})
  }, 100000)
})
