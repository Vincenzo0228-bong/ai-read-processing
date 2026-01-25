import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body('name') name: string,
    @Body('contact_channel') contactChannel: string,
    @Body('message') message: string,
  ) {
    return this.leadsService.createLead(
      req.user.userId,
      name,
      contactChannel,
      message,
    );
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.leadsService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  async findOne(@Req() req: AuthenticatedRequest) {
    // Always get id from params and ensure it's a string
    let leadId = req.params['id'];
    if (Array.isArray(leadId)) {
      leadId = leadId[0];
    }
    return this.leadsService.findOneForUser(req.user.userId, leadId);
  }
}
