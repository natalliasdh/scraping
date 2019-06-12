### PEOPLE magazine/Royal News Scraper

A web app that lets users view and leave comments on the latest news. Mongoose and Cheerio were used to scrape news from https://people.com/royals/.

Each scraped article is saved to the application database. The app scrapes and displays the following information for each article:

     * Headline - the title of the article
     * Photo
     * URL - the url to the original article

Users are able to leave comments on the articles displayed and revisit them later. The comments are saved to the database as well and associated with their articles. Users are also bable to delete comments left on articles. All stored comments are visible to every user.