/**
* name 
*/
module gamelonghu.page {
	export class LonghuPageDef extends game.gui.page.PageDef {
		static GAME_NAME: string;
		//龙虎斗界面
		static PAGE_LONGHU: string = "1";
		//龙虎斗地图UI
		static PAGE_LONGHU_MAP: string = "2";
		//龙虎斗开始下注界面
		static PAGE_LONGHU_BEGIN: string = "3";
		//龙虎斗游戏VS界面
		static PAGE_LONGHU_VS: string = "4";
		//龙虎斗停止下注界面
		static PAGE_LONGHU_END: string = "5";
		//龙虎斗大路界面
		static PAGE_LONGHU_ROAD: string = "6";
		//龙虎斗游戏规则界面
		static PAGE_LONGHU_RULE: string = "101";


		static myinit(str: string) {
			super.myinit(str);
			LonghuClip.init()
			PageDef._pageClassMap[LonghuPageDef.PAGE_LONGHU] = LonghuPage;
			PageDef._pageClassMap[LonghuPageDef.PAGE_LONGHU_MAP] = LonghuMapPage;
			PageDef._pageClassMap[LonghuPageDef.PAGE_LONGHU_BEGIN] = LonghuBeginPage;
			PageDef._pageClassMap[LonghuPageDef.PAGE_LONGHU_RULE] = LonghuRulePage;
			PageDef._pageClassMap[LonghuPageDef.PAGE_LONGHU_VS] = LonghuVSPage;
			PageDef._pageClassMap[LonghuPageDef.PAGE_LONGHU_END] = LonghuEndPage;
			PageDef._pageClassMap[LonghuPageDef.PAGE_LONGHU_ROAD] = LonghuRoadPage;


			this["__needLoadAsset"] = [
				DatingPath.atlas_dating_ui + "qifu.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "qifu.atlas",
                Path_game_longhu.atlas_game_ui + "longhu.atlas",
				Path_game_longhu.ui_longhu_effect_sk + "longhu.png",
                PathGameTongyong.atlas_game_ui_tongyong + "hud.atlas",
                PathGameTongyong.atlas_game_ui_tongyong + "pai.atlas",
                PathGameTongyong.atlas_game_ui_tongyong + "general.atlas",
                PathGameTongyong.atlas_game_ui_tongyong + "touxiang.atlas",
                PathGameTongyong.atlas_game_ui_tongyong + "chongzhi.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "dating.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "logo.atlas",
                PathGameTongyong.atlas_game_ui_tongyong + "nyl.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "yq.atlas",
                PathGameTongyong.atlas_game_ui_tongyong + "general/effect/suiji.atlas",
                PathGameTongyong.atlas_game_ui_tongyong + "general/effect/fapai_1.atlas",
                PathGameTongyong.atlas_game_ui_tongyong + "general/effect/xipai.atlas",
                PathGameTongyong.atlas_game_ui_tongyong + "general/effect/kaipai.atlas",
                Path_game_longhu.atlas_game_ui + "longhu/effect/hu.atlas",
                Path_game_longhu.atlas_game_ui + "longhu/effect/long.atlas",
                Path_game_longhu.atlas_game_ui + "longhu/effect/bipai.atlas",
                PathGameTongyong.atlas_game_ui_tongyong_general + "anniu.atlas",
				PathGameTongyong.atlas_game_ui_tongyong_general_effect + "anniug.atlas",
                PathGameTongyong.atlas_game_ui_tongyong_general_effect + "ksyx.atlas",
                PathGameTongyong.atlas_game_ui_tongyong_general_effect + "ksxz.atlas",

				Path.custom_atlas_scene + 'card.atlas',
				Path.custom_atlas_scene + 'chip.atlas',
				PathGameTongyong.ui_tongyong_sk + "HeGuan.sk",
				PathGameTongyong.ui_tongyong_sk + "HeGuan.png",
				Path.map + 'pz_longhu.png',
				Path.map_far + 'bg_longhu.jpg'
			]

			if (WebConfig.needMusicPreload) {
				this["__needLoadAsset"] = this["__needLoadAsset"].concat([
					Path_game_longhu.music_longhu + "lh_bgm.mp3",
					Path_game_longhu.music_longhu + "chouma.mp3",
					Path_game_longhu.music_longhu + "dian1.mp3",
					Path_game_longhu.music_longhu + "dian2.mp3",
					Path_game_longhu.music_longhu + "dian3.mp3",
					Path_game_longhu.music_longhu + "dian4.mp3",
					Path_game_longhu.music_longhu + "dian5.mp3",
					Path_game_longhu.music_longhu + "dian6.mp3",
					Path_game_longhu.music_longhu + "dian7.mp3",
					Path_game_longhu.music_longhu + "dian8.mp3",
					Path_game_longhu.music_longhu + "dian9.mp3",
					Path_game_longhu.music_longhu + "dian10.mp3",
					Path_game_longhu.music_longhu + "dian11.mp3",
					Path_game_longhu.music_longhu + "dian12.mp3",
					Path_game_longhu.music_longhu + "dian13.mp3",
					Path_game_longhu.music_longhu + "dingding_end.mp3",
					Path_game_longhu.music_longhu + "dingding_start.mp3",
					Path_game_longhu.music_longhu + "he.mp3",
					Path_game_longhu.music_longhu + "hu_win.mp3",
					Path_game_longhu.music_longhu + "long_win.mp3",
					Path_game_longhu.music_longhu + "paoxiao.mp3",
					Path_game_longhu.music_longhu + "piaoqian.mp3",
					Path_game_longhu.music_longhu + "shouqian.mp3",
					Path_game_longhu.music_longhu + "xiazhu_end.mp3",
					Path_game_longhu.music_longhu + "xiazhu_start.mp3",
				])
			}
		}
	}
}