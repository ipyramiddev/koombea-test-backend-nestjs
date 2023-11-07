import { Injectable } from '@nestjs/common';
import { WebPage, Link } from '../models/webpages.model';
import { DatabaseService } from 'src/mysql/services/database.service'; 
import { WebscrapingService } from 'src/webscraping/webscraping.service';
import { link } from 'fs';

@Injectable()
export class WebpagesService {
  constructor(private readonly databaseService: DatabaseService, private readonly webscrapingService: WebscrapingService) {}

  async createPage(page: WebPage, userId: number): Promise<WebPage> {
    const sql = 'INSERT INTO pages (url, user_id) VALUES (?, ?)';
    const values = [page.url, userId];

    const result = await this.databaseService.executeQuery(sql, values);
    const pageId = result.insertId;

    const scrapedData = await this.webscrapingService.scrapeWebsite(page.url, pageId);

    const sql2 = 'UPDATE pages SET title = ?, status =1 WHERE id = ?';
    const values2 = [scrapedData.title, pageId];
    await this.databaseService.executeQuery(sql2, values2);

    return {
      id: pageId,
      title: scrapedData.title,
      url: page.url,
      userId: userId,
      status: 1,
      links: scrapedData.links
    };
  }

  async getPageById(pageId: number): Promise<WebPage | null> {
    const sql = 'SELECT * FROM pages WHERE id = ?';
    const values = [pageId];

    const result = await this.databaseService.executeQuery(sql, values);

    if (result.length === 0) {
      return null;
    }

    // Map database result to a Page object
    const page: WebPage = {
      ...result[0],
      links: [],
    };

    return page;
  }
  
  async getPagesWithPagination(userId: number, page: number = 1, limit: number = 10): Promise<any> {
    const offset = (page - 1) * limit;
    const pageLimit: number = limit * 1;
    const sql = `SELECT p.*, COUNT(links.id) as linkCnt FROM 
    (SELECT * FROM pages WHERE user_id = ? ORDER BY id DESC LIMIT ?, ?) as p
    LEFT JOIN links ON p.id = links.page_id
    GROUP BY p.id`;
    const values = [userId, offset, pageLimit] ;

    const result = await this.databaseService.executeQuery(sql, values);

    // Map database results to an array of Page objects
    const pages: WebPage[] = result.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      status: row.status,
      linkCnt: row.linkCnt,
      links: []
    }));

    const sql_count = `SELECT COUNT(*) FROM pages WHERE user_id=?`;
    const value_count = [userId];

    const result_count = await this.databaseService.executeQuery(sql_count, value_count);

    const response = {
      pages: pages,
      totalCnt: result_count[0]['COUNT(*)']
    }

    return response;
  }

  async getLinksForPage(userId: number, pageId: number = 1, page: number, limit: number ): Promise<{links: Link[], totalCnt: number}> {

    // Check if this is valid access
    const sql = 'SELECT * FROM pages WHERE user_id = ? AND id = ?';
    const values = [userId, pageId];

    const result = await this.databaseService.executeQuery(sql, values);

    if (result.length == 0) {
      throw new Error(`There is no such a page`);
    }

    const offset = (page - 1) * limit;
    const pageLimit: number = limit * 1;
    const sql2 = 'SELECT * FROM links WHERE page_id = ? LIMIT ?, ?';
    const values2 = [pageId, offset, pageLimit];
    const result2 = await this.databaseService.executeQuery(sql2, values2);
    const links = result2.map((row) => ({
      id: row.id,
      name: row.name,
      url: row.url,
      page_id: row.page_id
    }));

    const sql_count = `SELECT COUNT(*) FROM links WHERE page_id = ${pageId}`;
    const value_count = [userId];

    const result_count = await this.databaseService.executeQuery(sql_count, value_count);

    const response = {
      links: links,
      totalCnt: result_count[0]['COUNT(*)']
    }

    return response;
  }
  
}
