import {
  EventSubChannelCheerEvent,
  EventSubChannelFollowEvent,
  EventSubChannelSubscriptionEvent,
} from "@twurple/eventsub/lib";
import { Emit } from "../../types";
import { TwitchUser } from "./types";

function getUserFromEvent(event: {
  userId: string;
  userName: string;
  userDisplayName: string;
}): TwitchUser {
  return {
    id: event.userId,
    name: event.userName,
    displayName: event.userDisplayName,
  };
}

function getBroadcasterFromEvent(event: {
  broadcasterId: string;
  broadcasterName: string;
  broadcasterDisplayName: string;
}): TwitchUser {
  return {
    id: event.broadcasterId,
    name: event.broadcasterName,
    displayName: event.broadcasterDisplayName,
  };
}

export interface TwitchFollowEvent {
  type: "TwitchFollow";
  payload: {
    timestamp: Date;
    user: TwitchUser;
    broadcaster: TwitchUser;
  };
}

export function getFollowListener(emit: Emit) {
  return function followListener(event: EventSubChannelFollowEvent): void {
    emit({
      type: "TwitchFollow",
      payload: {
        timestamp: event.followDate,
        user: getUserFromEvent(event),
        broadcaster: getBroadcasterFromEvent(event),
      },
    } as TwitchFollowEvent);
  };
}

export interface TwitchCheerEvent {
  type: "TwitchCheer";
  payload: {
    bits: number;
    message: string;
    isAnonymous: boolean;
    user: TwitchUser;
    broadcaster: TwitchUser;
  };
}

export function getCheerListener(emit: Emit) {
  return function cheerListener(event: EventSubChannelCheerEvent): void {
    emit({
      type: "TwitchCheer",
      payload: {
        bits: event.bits,
        message: event.message,
        isAnonymous: event.isAnonymous,
        user: getUserFromEvent(event),
        broadcaster: getBroadcasterFromEvent(event),
      },
    } as TwitchCheerEvent);
  };
}

export interface TwitchSubscribeEvent {
  type: "TwitchSubscribe";
  payload: {
    tier: string;
    isGift: boolean;
    user: TwitchUser;
    broadcaster: TwitchUser;
  };
}

export function getSubscribeListener(emit: Emit) {
  return function subscribeListener(
    event: EventSubChannelSubscriptionEvent
  ): void {
    emit({
      type: "TwitchSubscribe",
      payload: {
        tier: event.tier,
        isGift: event.isGift,
        user: getUserFromEvent(event),
        broadcaster: getBroadcasterFromEvent(event),
      },
    } as TwitchSubscribeEvent);
  };
}
