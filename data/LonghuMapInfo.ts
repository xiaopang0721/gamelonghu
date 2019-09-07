/**
* name 
*/
module gamelonghu.data {
	export class LonghuMapInfo extends gamecomponent.object.MapInfoT<LonghuData> {
		//地图状态变更
		static EVENT_STATUS_CHECK: string = "LonghuMapInfo.EVENT_STATUS_CHECK";
		//战斗体更新
		static EVENT_BATTLE_CHECK: string = "LonghuMapInfo.EVENT_BATTLE_CHECK";
		//回合数变化
		static EVENT_GAME_TURN_CHANGE: string = "LonghuMapInfo.EVENT_GAME_TURN_CHANGE";
		//牌局号
		static EVENT_GAME_NO: string = "LonghuMapInfo.EVENT_GAME_NO";
		//倒计时时间戳更新
		static EVENT_COUNT_DOWN: string = "LonghuMapInfo.EVENT_COUNT_DOWN";
		//游戏记录更新
		static EVENT_GAME_RECORD: string = "LonghuMapInfo.EVENT_GAME_RECORD";
		//上庄列表更新
		static EVENT_SZ_LIST: string = "LonghuMapInfo.EVENT_SZ_LIST";
		//入座列表更新
		static EVENT_SEATED_LIST: string = "LonghuMapInfo.EVENT_SEATED_LIST";
		//地图庄家改变
		static EVENT_MAP_BANKER_CHANGE: string = "LonghuMapInfo.EVENT_MAP_BANKER_CHANGE";
		//牌库数量变化
		static EVENT_CARD_POOL_CHANGE: string = "LonghuMapInfo.EVENT_CARD_POOL_CHANGE";
		//大路记录变化
		static EVENT_ROAD_RECORD: string = "LonghuMapInfo.EVENT_ROAD_RECORD";

		constructor(v: SceneObjectMgr) {
			super(v, () => { return new LonghuData() });

		}

		//当对象更新发生时
		protected onUpdate(flags: number, mask: UpdateMask, strmask: UpdateMask): void {
			super.onUpdate(flags, mask, strmask);
			let isNew = flags & core.obj.OBJ_OPT_NEW;
			if (isNew || mask.GetBit(MapField.MAP_INT_MAP_BYTE)) {
				this._sceneObjectMgr.event(LonghuMapInfo.EVENT_STATUS_CHECK);
			}
			if (isNew || mask.GetBit(MapField.MAP_INT_BATTLE_INDEX)) {
				this._battleInfoMgr.OnUpdate();
				this._sceneObjectMgr.event(LonghuMapInfo.EVENT_BATTLE_CHECK);
			}
			if (isNew || mask.GetBit(MapField.MAP_INT_MAP_BYTE1)) {
				this._sceneObjectMgr.event(LonghuMapInfo.EVENT_GAME_TURN_CHANGE);
			}
			if (isNew || mask.GetBit(MapField.MAP_INT_COUNT_DOWN)) {
				this._sceneObjectMgr.event(LonghuMapInfo.EVENT_COUNT_DOWN);
			}
			if (isNew || mask.GetBit(MapField.MAP_INT_MAP_UINT16)) {
				this._sceneObjectMgr.event(LonghuMapInfo.EVENT_MAP_BANKER_CHANGE, 1);
			}
			if (isNew || mask.GetBit(MapField.MAP_INT_MAP_UINT16)) {
				this._sceneObjectMgr.event(LonghuMapInfo.EVENT_CARD_POOL_CHANGE);
			}
			if (isNew || strmask.GetBit(MapField.MAP_STR_GAME_NO)) {
				this._sceneObjectMgr.event(LonghuMapInfo.EVENT_GAME_NO);
			}
			if (isNew || strmask.GetBit(MapField.MAP_STR_GAME_RECORD)) {
				this._sceneObjectMgr.event(LonghuMapInfo.EVENT_GAME_RECORD);
			}
			if (isNew || strmask.GetBit(MapField.MAP_STR_SZ_LIST)) {
				this._sceneObjectMgr.event(LonghuMapInfo.EVENT_SZ_LIST);
			}
			if (isNew || strmask.GetBit(MapField.MAP_STR_SEATED_LIST)) {
				this._sceneObjectMgr.event(LonghuMapInfo.EVENT_SEATED_LIST);
			}
			if (isNew || strmask.GetBit(MapField.MAP_STR_ROAD_RECORD)) {
				this._sceneObjectMgr.event(LonghuMapInfo.EVENT_ROAD_RECORD);
			}
		}

		private areaName = ["和", "龙", "虎", "龙黑", "龙红", "龙梅", "龙方", "虎黑", "虎红", "虎梅", "虎方"];
		public getBattleInfoToString(): string {
			let playerArr: any[] = this._battleInfoMgr.users;
			if (!playerArr) return "";
			let selfSeat: number = -1;
			for (let i: number = 0; i < playerArr.length; i++) {
				let player = playerArr[i];
				if (player && this._sceneObjectMgr.mainPlayer.GetAccount() == player.account) {
					//找到自己了
					selfSeat = i + 1;
					break;
				}
			}
			if (selfSeat == -1) return "";
			let infoArr: gamecomponent.object.BattleInfoBase[] = this._battleInfoMgr.info;
			if (!infoArr) return "";
			let totalStr: string = "";
			let lotteryStr: string = "";
			let settleStr: string = "";
			let cardsStr: string = "";
			let betStr: Array<string> = [];
			let betInfo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			for (let i: number = 0; i < infoArr.length; i++) {
				let info = infoArr[i];
				if (info.SeatIndex == selfSeat) {//百人场只取出自己的战斗信息
					if (info instanceof gamecomponent.object.BattleInfoAreaBet) {//下注
						betInfo[info.BetIndex - 1] += info.BetVal;
					}
					else if (info instanceof gamecomponent.object.BattleInfoSettle) {//结算
						//结算
						settleStr = info.SettleVal == 0 ? "0" : info.SettleVal > 0 ? "+" + EnumToString.getPointBackNum(info.SettleVal, 2) : "" + EnumToString.getPointBackNum(info.SettleVal, 2);
						//结算信息都出来了，就不再继续找了
						break;
					}
				}
				if (info instanceof gamecomponent.object.BattleInfoDeal) {//开牌
					if (!cardsStr)
						cardsStr = info.SeatIndex == 2 ? "龙:" + info.CardType + "点" : "虎:" + info.CardType + "点";
					else
						cardsStr += info.SeatIndex == 2 ? " , " + "龙:" + info.CardType + "点" : " , " + "虎:" + info.CardType + "点";
				}
				else if (info instanceof gamecomponent.object.BattleLogCardsResult) {//中奖区域
					for (let i = 0; i < info.Results.length; i++) {
						if (!lotteryStr)
							lotteryStr = this.areaName[info.Results[i] - 1];
						else
							lotteryStr += " , " + this.areaName[info.Results[i] - 1];
					}
				}
			}

			let count = 0;
			let index = 0;
			for (let i: number = 0; i < betInfo.length; i++) {
				if (betInfo[i] > 0) {
					if (count == 4) {
						count = 0;
						index++;
					}
					if (!betStr[index]) {
						betStr[index] = StringU.substitute("{0}({1})", this.areaName[i], betInfo[i]);
					}
					else {
						betStr[index] += " , " + StringU.substitute("{0}({1})", this.areaName[i], betInfo[i]);
					}
					count++;
				}
			}

			//开奖信息
			totalStr += "开    奖：|" + cardsStr + "#";
			//中奖区域信息
			totalStr += "中    奖：|" + lotteryStr + "#";
			//下注信息
			for (let i = 0; i < betStr.length; i++) {
				if (i == 0) {
					totalStr += "下    注：|" + betStr[i] + "#";
				} else {
					totalStr += "|" + betStr[i] + "#";
				}
			}
			//结算信息
			totalStr += "结    算：|" + settleStr;

			return totalStr;
		}
	}
}