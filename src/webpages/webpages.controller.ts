import { Controller, Get, Post, Body, Query, Req, UnauthorizedException, Catch, ArgumentsHost, Param  } from '@nestjs/common';
import { WebpagesService } from './webpages.service';
import { WebPage, Link } from '../models/webpages.model';
import { User } from '../models/user.model';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Controller('webpages')
export class WebpagesController {
  constructor(private readonly webpagesService: WebpagesService) {}

  @Get()
  async getPages(
    @Req() req: AuthenticatedRequest,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<WebPage[]> {
    const user: User = req.user;
    if (!user) {
      throw new UnauthorizedException('Invalid JWT token');
    }
    return this.webpagesService.getPagesWithPagination(user.id, page, limit);
  }

  @Post()
  async createPage(
    @Req() req: AuthenticatedRequest,
    @Body() pageData: WebPage): Promise<WebPage> {

    return this.webpagesService.createPage(pageData, req.user.id);
  }

  @Get(':pageId')
  async getLinksForPage(
    @Param('pageId') pageId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<{links: Link[], totalCnt: number}> {
    const user: User = req.user;
    if (!user) {
      throw new UnauthorizedException('Invalid JWT token');
    }
    return this.webpagesService.getLinksForPage(user.id, pageId, page, limit);
  }
}
