/**
* name 
*/
module gamelonghu.page {
	export class LonghuSzListPage extends game.gui.base.Page {
		private _viewUI: ui.nqp.game_ui.tongyong.ShangZhuangLBUI;
		private _isShenQing: boolean = false;

		constructor(v: Game, onOpenFunc?: Function, onCloseFunc?: Function) {
			super(v, onOpenFunc, onCloseFunc);
			this._isNeedBlack = true;
			this._isClickBlack = false;
			this._asset = [
				PathGameTongyong.atlas_game_ui_tongyong+ "general.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "touxiang.atlas",
				PathGameTongyong.atlas_game_ui_tongyong+ "hud.atlas",
			];
		}

		protected init(): void {
			this._viewUI = this.createView('game_ui.tongyong.ShangZhuangLBUI');
			this.addChild(this._viewUI);
			
			this._game.sceneObjectMgr.on(LonghuMapInfo.EVENT_MAP_BANKER_CHANGE, this, this.onUpdateSZList);//地图庄家变更
			this._game.sceneObjectMgr.on(LonghuMapInfo.EVENT_SZ_LIST, this, this.onUpdateSZList);//上庄列表更新
			this.onUpdateSZList();
		}

		// 页面打开时执行函数
		protected onOpen(): void {
			super.onOpen();
			this._viewUI.list_player.vScrollBarSkin = "";
			this._viewUI.list_player.scrollBar.autoHide = false;
			this._viewUI.list_player.scrollBar.elasticDistance = 100;
			this._viewUI.list_player.itemRender = this.createChildren("game_ui.tongyong.WanJia1UI", SzItemRender);
			this._viewUI.list_player.renderHandler = new Handler(this, this.renderHandler);
			this._viewUI.btn_shangzhuang.on(LEvent.CLICK, this, this.onBtnClickWithTween);
			let mapInfo = this._game.sceneObjectMgr.mapInfo;
			if (mapInfo) {
				this.onUpdateSZList();
			}
			this._viewUI.list_player.dataSource = this.dataSource;
		}

		//按钮缓动回调
		protected onBtnTweenEnd(e: any, target: any): void {
			switch (target) {
				case this._viewUI.btn_shangzhuang://申请上庄
					let money = this._game.sceneObjectMgr.mainUnit.GetMoney();
					if (money < this.dataSource) {
						this._game.uiRoot.topUnder.showTips("金币不足");
						return;
					}
					let mapinfo: LonghuMapInfo = this._game.sceneObjectMgr.mapInfo as LonghuMapInfo;
					let mainIndex = this._game.sceneObjectMgr.mainUnit.GetIndex();
					if (mainIndex == mapinfo.GetBankerSeat()) {//申请下庄
						this._game.network.call_longhu_xiazhuang();
						this._game.uiRoot.topUnder.showTips("已经成功申请下庄");
						this.close()
					} else if (this._isShenQing) {//取消申请
						this._game.network.call_longhu_xiazhuang();
						this._game.uiRoot.topUnder.showTips("已经取消申请上庄");
						this.close()
					} else {//申请上庄
						this._game.network.call_longhu_shangzhuang();
						this._game.uiRoot.topUnder.showTips("已经成功申请上庄");
						this.close()
					}
					break;
			}
		}

		private renderHandler(cell: SzItemRender, index: number) {
			if (cell) {
				cell.setData(this._game, cell.dataSource);
			}
		}

		private onUpdateSZList() {
			let mapinfo: LonghuMapInfo = this._game.sceneObjectMgr.mapInfo as LonghuMapInfo;
			if (!mapinfo) return;
			let unitSz = [];
			let szList = mapinfo.GetSzList();
			if (szList == "") {
				return;
			}
			let limitMoney = LonghuMapPage.MONEY_LIMIT_CONFIG[mapinfo.GetMapLevel()][0]
			this._viewUI.txt_limit.text = "上庄需要 " + limitMoney;
			unitSz = JSON.parse(szList);
			this._viewUI.list_player.dataSource = unitSz;

			let mainIndex = this._game.sceneObjectMgr.mainUnit.GetIndex();
			for (let i = 0; i < unitSz.length; i++) {
				let unitIndex = unitSz[i][0];
				if (mainIndex == unitIndex) {
					this._isShenQing = true;
				} else {
					this._isShenQing = false;
				}
			}
			if (!unitSz.length) this._isShenQing = false;
			let url = this._isShenQing ? PathGameTongyong.ui_tongyong_general + "btn_qxsq.png" : PathGameTongyong.ui_tongyong_general + "btn_sqsz.png";
			if (mainIndex == mapinfo.GetBankerSeat()) url = PathGameTongyong.ui_tongyong_general + "btn_sqxz.png";
			this._viewUI.btn_shangzhuang.skin = url;
		}

		public close(): void {
			if (this._viewUI) {
				this._viewUI.list_player.vScrollBarSkin = null;
				this._viewUI.btn_shangzhuang.off(LEvent.CLICK, this, this.onBtnClickWithTween);
			}

			this._game.sceneObjectMgr.off(LonghuMapInfo.EVENT_MAP_BANKER_CHANGE, this, this.onUpdateSZList);//地图庄家变更
			this._game.sceneObjectMgr.off(LonghuMapInfo.EVENT_SZ_LIST, this, this.onUpdateSZList);//上庄列表更新
			super.close();
		}
	}

	class SzItemRender extends ui.nqp.game_ui.tongyong.WanJia1UI {
		private _game: Game;
		private _unit: Unit;
		private _clipMoney: LonghuClip;
		private _unitHeadImg: string;
		setData(game: Game, data: any) {
			this._game = game;
			this._unit = this._game.sceneObjectMgr.getUnitByIdx(data[0]);
			this._unitHeadImg = this._unit.GetHeadImg();

			this.txt_name.text = this._unit.GetName();
			if (this._unitHeadImg) {
				this.img_head.skin = PathGameTongyong.ui_tongyong_touxiang + "head_" + this._unitHeadImg + ".png";
			}
			if (!this._clipMoney) {
				this._clipMoney = new LonghuClip(LonghuClip.MONEY_FONT2)
				this._clipMoney.x = this.clip_money.x;
				this._clipMoney.y = this.clip_money.y;
				this.clip_money.parent.addChild(this._clipMoney);
				this.clip_money.visible = false;
			}
			this._clipMoney.setText(EnumToString.getPointBackNum(this._unit.GetMoney(), 2) + "", true, false);
		}
	}
}