/**
* name 
*/
module gamelonghu.page {
	export class LonghuVSPage extends game.gui.base.Page {
		private _viewUI: ui.ajqp.game_ui.longhu.BiPaiUI;
		private _clip: LonghuClip;

		constructor(v: Game, onOpenFunc?: Function, onCloseFunc?: Function) {
			super(v, onOpenFunc, onCloseFunc);
			this._isNeedBlack = true;
			this._isClickBlack = false;
			this._asset = [
				Path_game_longhu.atlas_game_ui + "longhu.atlas",
				Path_game_longhu.atlas_game_ui + "longhu/effect/bipai.atlas",
			];
		}

		// 页面初始化函数
		protected init(): void {
			this._viewUI = this.createView('game_ui.longhu.BiPaiUI');
			this.addChild(this._viewUI);
		}

		// 页面打开时执行函数
		protected onOpen(): void {
			super.onOpen();
			this._clip = new LonghuClip(LonghuClip.JU_FONT);
			this._clip.anchorX = 0.5;
			this._clip.anchorY = 0.5;
			this._clip.setText(this._game.sceneObjectMgr.mapInfo.GetRound() + "", true, false);
			this._clip.x = this._viewUI.clip_turn.x;
			this._clip.y = this._viewUI.clip_turn.y;
			this._viewUI.clip_turn.parent.addChild(this._clip);
			this._viewUI.clip_turn.visible = false;

			this._viewUI.ani1.on(LEvent.COMPLETE, this, this.onPlayComplte);
			this._viewUI.ani1.play(0, false);
		}

		private onPlayComplte(): void {
			this.close();
		}

		public close(): void {
			if (this._viewUI) {
			}
			super.close();
		}
	}
}