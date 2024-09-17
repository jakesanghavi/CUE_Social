import { ROUTE } from './constants';

export const upvoteCheck = async (deck, loggedInUser, setOne, ...setDecks) => {
    if (!loggedInUser || !loggedInUser.email) {
      return
    }
  
    const updatedDecks = (decks) => {
      return decks.map((d) => {
        if (d._id === deck._id) {
          const isUpvoted = d.voters.includes(loggedInUser.username);
          const newVoters = isUpvoted
            ? d.voters.filter((voter) => voter !== loggedInUser.username)
            : [...d.voters, loggedInUser.username];
          const newScore = isUpvoted ? d.score - 1 : d.score + 1;
          return { ...d, voters: newVoters, score: newScore };
        }
        return d;
      });
    };

    const updateDeck = (deck) => {
        const isUpvoted = deck.voters.includes(loggedInUser.username);
        const newVoters = isUpvoted
          ? deck.voters.filter((voter) => voter !== loggedInUser.username)
          : [...deck.voters, loggedInUser.username];
        const newScore = isUpvoted ? deck.score - 1 : deck.score + 1;
        
        return { ...deck, voters: newVoters, score: newScore };
      };
  
    try {
      const response = await fetch(`${ROUTE}/api/decks/onedeck/${deck._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch decks');
      }
      const data = await response.json();
      let voters = data.voters;
  
      if (voters.includes(loggedInUser.username)) {
        voters = voters.filter(voter => voter !== loggedInUser.username);
  
        try {
          const change = 'decrease'
          const response = await fetch(`${ROUTE}/api/decks/onedeck/${deck._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ voters, change })
          });
          if (!response.ok) {
            throw new Error('Failed to fetch decks');
          }
        } catch (error) {
          console.error('Error fetching decks:', error);
        }
      } else {
        voters.push(loggedInUser.username)
        try {
          const change = 'increase'
          const response = await fetch(`${ROUTE}/api/decks/onedeck/${deck._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ voters, change })
          });
          if (!response.ok) {
            throw new Error('Failed to fetch decks');
          }
        } catch (error) {
          console.error('Error fetching decks:', error);
        }
      }
      
      if (!setOne) {
        setDecks.forEach(setDeck => setDeck((prev) => updatedDecks(prev)));
      }
      else {
        setDecks.forEach(setDeck => setDeck((prev) => updateDeck(prev)));
      }
      
  
    } catch (error) {
      console.error('Error fetching decks:', error);
    }
  }

export const customCardBorders = () => {
  return ['http://res.cloudinary.com/defal1ruq/image/upload/v1726538852/Science_Rare_ihtadd.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538843/Life_Rare_wc12bm.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538853/Science_Common_czn6mp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538846/Paleo_Ultra_Fusion_vhpmjp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538856/Oceans_Limcomm_zdv1wx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538848/Arts_Limleg_vtivu8.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538846/History_Limrare_fza986.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538858/Oceans_Limrare_ld8bke.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538860/Oceans_Epic_pyoggi.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538851/Arts_Common_fqh6k7.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538859/Oceans_Rare_ze1kno.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538830/Life_Legendary_qx4dkk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538861/Science_Legendary_v6hciw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538825/History_Common_hwpqcx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538829/Life_Limleg_ac4gbk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538844/Life_Common_wbirox.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538853/Science_Limrare_hxhdkj.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538828/Science_Mythic_avfam9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538843/Life_Limcomm_g72wo9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538850/Arts_Limrare_qhhtct.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538847/Arts_Legendary_wboswk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538855/Oceans_Common_ctlh1a.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538849/Arts_Limepic_iuubuq.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538846/History_Rare_diswm5.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538829/Science_Ultra_Fusion_dduo5n.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538857/Science_Fusion_dcupg9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538824/History_Epic_bpq8uc.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538856/Science_Limleg_m8zhbm.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538826/History_Limepic_aonol8.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538824/History_Legendary_voxuko.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538854/Science_Limcomm_nbgw72.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538855/Science_Limepic_tqjria.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538848/Arts_Epic_dk0om8.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538825/History_Limcomm_p3czao.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538852/Arts_Limcomm_yyevgr.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538830/Life_Limepic_ausaox.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538859/Oceans_Limepic_svu2rh.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538861/Science_Epic_w9a0mk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538850/Arts_Rare_n3hvg8.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538827/History_Limleg_gpijel.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538831/Life_Epic_rxlwga.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726538843/Life_Limrare_nng96t.png']
}
  
export const customCardIcons = () => {
  return ['http://res.cloudinary.com/defal1ruq/image/upload/v1726540345/primate_t_oaburs.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540283/lifespec_t_znjmcw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540280/lcritter_t_srlohz.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540371/solarsystem_t_h3qm76.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540247/fabfish_t_pztzlv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540382/structure_t_k5ekud.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540255/funiverse_t_vmuz1m.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540267/histspec_t_uy8dn7.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540385/tree_t_sok3nn.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540358/scimyth_t_ts24n1.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540212/aztecmyth_t_yoo9um.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540295/monstdeep_t_pujbk9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540342/plant_t_u2w5i3.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540355/roman_t_uustra.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540316/philosopher_t_mvbpaf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540216/body_t_ebntuv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540229/crustacean_t_rrkyyg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540232/deepocean_t_lu26dg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540393/volcano_t_s5tc09.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540378/spacetech_t_vflg2q.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540313/paleofus_t_urlkfs.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540350/river_t_qqmlzh.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540221/cephalopod_t_t2vuou.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540272/iceage_t_zsdx9g.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540222/cfolklore_t_zizkkd.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540207/artmyth_t_d5s6m7.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540270/humanevo_t_faucmi.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540198/agreece_t_kjhoww.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540260/graphicdesign_t_dx1lk3.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540401/zodiac_t_sdansg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540259/gmyth_t_mzs6kg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540199/amfolk_t_cnjf71.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540344/play_t_ymrxcs.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540268/hoaxcon_t_bm6zk2.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540224/colors_t_i5j74c.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540306/oldwest_t_wwgg0n.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540219/carni_t_bebvsp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540386/tudors_t_bsycwa.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540367/secretsociety_t_weup2m.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540196/acreature_t_fdi65i.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540290/medicine_t_g1h3gi.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540248/fashions_t_t992e9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540279/landtime_t_asoapd.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540294/money_t_v4ge3l.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540318/pirate_t_lpjprf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540357/scifus_t_p1kfb8.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540241/element_t_pymqhf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540390/venom_t_snsvel.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540379/sport_t_ikszmt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540370/shark_t_gyifbk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540261/halloween_t_jtbe02.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540397/weird_t_nrb02f.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540257/gem_t_rf7zbp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540209/astronaut_t_wlurfl.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540393/warinno_t_kodvml.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540301/nebula_t_b5d513.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540287/marsupial_t_mjnwab.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540228/coolcat_t_dyc1k9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540281/lifefus_t_wgh6si.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540253/fnature_t_nipd2b.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540243/espionage_t_aewffo.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540352/robinhood_t_pm7og5.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540399/write_t_dv7qh9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540203/aroundreef_t_prgj6l.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540310/oreptile_t_fssdnx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540274/inginvention_t_bilevt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540230/cuisine_t_lzxjry.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540395/watchingtheskies_t_ujp8dl.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540234/discovery_t_b8j4nt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540283/lifemyth_t_ocv8vj.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540292/molluscswaterbugs_t_nkylee.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540263/herbi_t_ajz6w8.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540223/climate_t_qmxqvc.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540217/bug_t_o6tyds.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540252/flyer_t_n1bahf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540231/cutecat_t_qwuad2.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540278/jfolk_t_gbn6bo.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540381/stagescreen_t_nfjqcg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540286/mammal_t_pjk2y6.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540349/rite_t_cjhvn2.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540377/spacespec_t_xczmky.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540394/warmachine_t_r4sh4k.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540384/tarot_t_mtaaee.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540226/constellation_t_xdg9th.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540276/japan_t_xkugfp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540205/arthurian_t_ta4tav.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540389/undermicro_t_usqbu5.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540293/monarch_t_jfia7c.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540233/design_t_wgbaux.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540369/shakesystem_t_xfr0da.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540275/instrument_t_mbpfid.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540289/math_t_tmupll.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540311/painter_t_zpgiie.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540214/bird_t_ftuc1i.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540356/sbitb_t_taak9d.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540236/document_t_nfqplg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540353/rocket_t_ajd9rw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540347/reptile_t_ntoqgt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540319/planetside_t_la9pr8.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540363/seabird_t_i9dnpv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540242/energy_t_ub7hxx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540263/heartbreak_t_hc3bql.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540300/natmonument_t_u8ybt9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540240/egyptmyth_t_ib0txg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540348/ridingwaves_t_lu9yod.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540303/nmyth_t_mmgvot.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540304/occult_t_a7ornm.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540201/amphibian_t_pqimix.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540256/futurology_t_zrlqt1.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540213/battle_t_o3atff.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540399/wonder_t_sr4j6d.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540204/artfus_t_tyunbt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540315/paleospec_t_hnndry.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540237/dog_t_lkb2iw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540251/festivetradition_t_dkwzil.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540197/aegypt_t_ak1b6v.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540202/amrev_t_ng8pkx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540366/seaspec_t_dnj5es.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540361/scispec_t_qxr6ef.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540266/histmyth_t_r0fcum.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540297/musically_t_rfrjlt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540299/mythcreatures_t_ucajpg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540219/butterfly_t_nuhgoo.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540309/omni_t_ejhipm.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540315/paleomyth_t_ac7rga.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540285/ltreasure_t_mvwvfs.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540363/seafus_t_o5vhgm.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540308/omammal_t_gujkob.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540271/hybrid_t_ze63tb.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540211/aviation_t_vdr9qn.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540374/spacemyth_t_mycfcj.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540376/spaceoddities_t_voa0yr.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540246/exploringstars_t_hbvi0c.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540373/spacefus_t_zklrfb.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540208/artspec_t_ctuv4h.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540365/seamyth_t_ffhlzr.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540238/dpevo_t_paddln.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540305/odyssey_t_oe2ppc.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540296/mountain_t_qekj9y.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540244/exploration_t_z5tzlm.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540388/underground_t_bfx32s.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540265/histfus_t_koco6u.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540250/feistyfish_t_vmaav6.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540360/scipioneer_t_p84uxv.png']
}