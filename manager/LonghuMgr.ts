/**
* name 
*/
module gamelonghu.manager {
	export class LonghuMgr extends gamecomponent.managers.PlayingCardMgrBase<LonghuData>{
		static readonly MAPINFO_OFFLINE: string = "LonghuMgr.MAPINFO_OFFLINE";//假精灵
		static readonly DEAL_OVER: string = "LonghuMgr.DEAL_OVER";//发牌结束
		static readonly SHOW_OVER: string = "LonghuMgr.SHOW_OVER";//开牌结束

		private _winnerIndex: number;//赢家位置
		private _offlineUnit: UnitOffline;//假精灵信息
		private _isCancel: boolean = false;
		private _isReConnect: boolean = true;
		private _cardsIndex: Array<number> = [];//牌的归属位置

		constructor(game: Game) {
			super(game)
		}

		get offlineUnit() {
			return this._offlineUnit;
		}

		set offlineUnit(v) {
			this._offlineUnit = v;
			this.event(LonghuMgr.MAPINFO_OFFLINE)
		}

		get isCancel() {
			return this._isCancel;
		}

		set isCancel(v) {
			this._isCancel = v;
			this.event(LonghuMgr.MAPINFO_OFFLINE)
		}

		get isReConnect() {
			return this._isReConnect;
		}

		set isReConnect(v) {
			this._isReConnect = v;
		}

		get allCards() {
			return this._cards;
		}

		//对牌进行排序 重写不需要排序
		SortCards(cards: any[]) {

		}

		sort() {
			let cards = this._cards;//牌堆
			let count = 0;
			for (let i = 0; i < this._cards.length; i++) {
				let card = cards[i] as LonghuData;
				if (card) {
					card.myOwner(i);
					card.index = i;
					card.sortScore = i;
				}
			}
		}

		initCard(all_val: Array<number>) {
			let card_arr = [];
			for (let i: number = 0; i < all_val.length; i++) {
				let card: LonghuData;
				card = new LonghuData();
				card.Init(all_val[i]);
				card_arr.push(card);
			}
			return card_arr;
		}

		setValue(_cards, i) {
			if (!this._cards.length) return;
			if (!_cards) return;
			let card = this._cards[i + 1] as LonghuData;
			if (card) {
				card.Init(_cards.GetVal());
				card.index = i;
				card.sortScore = i;
				card.visible = true;
				card.kaipai();
			}
		}

		//播放搓牌动画隐藏场景牌
		yincang(index: number) {
			let card: LonghuData;
			card = this._cards[index];
			if (!card) return;
			card.visible = false;
		}

		//发牌
		fapai() {
			let counter = 0;
			for (let i: number = 0; i < this._cards.length; i++) {
				Laya.timer.once(200 * i, this, () => {
					this._game.playSound(PathGameTongyong.music_tongyong + "fapai.mp3", false);
					let card = this._cards[i];
					if (!card) return;
					card.fapai();
					counter++;
					if (counter >= this._cards.length) {
						this.event(LonghuMgr.DEAL_OVER);
					}
				});
			}
		}

		//重新发牌（正常）
		refapai() {
			for (let i: number = 0; i < this._cards.length; i++) {
				let card = this._cards[i];
				if (!card) return;
				card.refapai();
			}
		}

		//翻牌
		fanpai() {
			let count = 1;
			for (let i: number = 0; i < this._cards.length; i++) {
				Laya.timer.once(500 * i, this, () => {
					let card = this._cards[i];
					if (!card) return;
					card.fanpai();
				});
				count++;
			}
		}

		//翻牌（断线重连）
		refanpai() {
			for (let i: number = 0; i < this._cards.length; i++) {
				let card = this._cards[i];
				if (!card) return;
				card.fanpai();
			}
		}
	}
}