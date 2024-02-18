import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  RawBodyRequest,
  Headers,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { UserRole } from 'src/enums/user-role.enum';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/authorization/permissions/permissions.guard';
import { ExtendedRequest } from 'src/interfaces/extended-request';
import { Status } from 'src/enums/status.enum';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(JwtGuard, PermissionsGuard)
  @SetMetadata('roles', [
    [UserRole.ADMIN, Status.APPROVED],
  ])
  @Post('createPackage')
  create(@Body() createStripeDto: CreateStripeDto) {
    return this.stripeService.createPackage(createStripeDto);
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @SetMetadata('roles', [
    [UserRole.ADMIN, Status.APPROVED],
  ])
  @Get('subscription/:userID')
  findOne(@Param('userID') userID: number) {
    return this.stripeService.getSubscription(userID);
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @Get('createSession/:priceID')
  createCheckoutSession(
    @Param('priceID') priceID: string,
    @Req() req: ExtendedRequest,
  ) {
    const userID = req.user.user.id;
    const userRole = req.user.user.role;
    // const organizationID = req.user.user.companyID || req.user.user.uniID;
    const organizationID = 1;
    return this.stripeService.generatePaymentSession(
      priceID,
      userRole as UserRole,
      organizationID,
      userID,
    );
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @SetMetadata('roles', [
    [UserRole.ADMIN, Status.APPROVED],
  ])
  @Get('allProducts')
  getAllProducts() {
    return this.stripeService.getAllProducts();
  }

  @Post('webhook')
  async webhook(@Request() req: RawBodyRequest<Request>, @Headers() headers) {
    const signature = headers['stripe-signature'];
    const [event, webhookError] =
      this.stripeService.verifyStriptWebhookSignature(req.rawBody, signature);

    if (webhookError)
      throw new HttpException(webhookError, HttpStatus.BAD_REQUEST);

    switch (event.type) {
      case 'checkout.session.expired':
        // TODO: tell the user that the checkout session has expired
        break;

      // * payment_intent.succeeded fires before checkout.session.completed, as far as I can see
      // * So we're running assuming this ^ happens always :)
      // * Update: I think we can live without payment_intent.succeeded
      case 'payment_intent.succeeded':
        const intentID = event.data.object.id;
        const amount = event.data.object.amount_received;
        await this.stripeService.createPaymentIntent(intentID, amount);

        console.log({ intent: event.data.object });
        // ? I think we can live without this considering our assumptions above
        // await this.stripeService.findSession(intentID);
        break;

      case 'checkout.session.completed':
        const [session, sessionError] =
          await this.stripeService.retrieveSession(event.data.object.id);
        if (sessionError) throw new HttpException(sessionError, 400);

        // If you ever need it
        const customerDetails = event.data.object.customer_details;

        const {
          metadata,
          amount_total: amount_,
          // payment_intent,
          subscription,
        } = session;
        const priceID = session.line_items.data[0].price.lookup_key;

        await this.stripeService.createPaymentSession(
          // new Types.ObjectId(metadata.userID),
          // new Types.ObjectId(metadata.organizationID),
          +metadata.userID,
          +metadata.organizationID,
          priceID,
          amount_,
          // payment_intent,
          subscription,
        );
        //  TODO: when their payment was done they should have moved to in-review
        // await this.stripeService.findIntentAndApproveSession(payment_intent);

        break;

      default:
        break;
    }
  }
}
