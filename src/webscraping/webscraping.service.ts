import { Injectable } from '@nestjs/common';
import axios from 'axios';
import cheerio from 'cheerio';
import { Link } from 'src/models/webpages.model';
import { DatabaseService } from 'src/mysql/services/database.service';

@Injectable()
export class WebscrapingService {
    constructor(private readonly databaseService: DatabaseService) {}

    removeSpecialCharacters(input: string): string {
        return input.replace(/[^a-zA-Z0-9\s]/g, '');
    }

    async scrapeWebsite(url: string, pageId: number): Promise<{title:string, links:Link[]}> {
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            // Use jQuery-like selectors to extract data
            const title = $('title').text();
            const links: Link[] = await Promise.all($('a').map(async (_index, element) => {
                let element_url = $(element).attr('href');
                let element_text = $(element).text().trim().replace(/\s+/g, ' ');
                let id = 0;
                if (element_url != null) {
                    const sql = 'INSERT INTO links (name, url, page_id) VALUES (?, ?, ?)';
                    const values = [element_text, element_url, pageId];
                    const result = await this.databaseService.executeQuery(sql, values);
                    id = result.insertId;
                }
                return {
                    id,
                    url:element_url, 
                    name:element_text,
                    pageId: pageId
                }
            }).get());

            return {
                title, 
                links
            };
        } catch (error) {
            console.error('Error while scraping website:', error);
            throw error;
        }
    }
}
