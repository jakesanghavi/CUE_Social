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
  return ['http://res.cloudinary.com/defal1ruq/image/upload/v1726945784/Space_Rare_jtwi0h.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945783/Space_Limrare_z2mjjv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945783/Space_Limleg_gu14nu.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945781/Space_Limepic_pabwj5.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945781/Space_Limcomm_kiu9ox.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945780/Space_Legendary_sbuhof.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945780/Space_Fusion_eu5zuk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945778/Space_Epic_eksrdt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945777/Space_Common_usvtrx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945777/Science_Ultra_Fusion_uyk2aq.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945776/Science_Mythic_ld8eio.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945776/Science_Rare_hplymn.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945774/Science_Limrare_oukkww.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945774/Science_Limleg_fwveam.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945772/Science_Limepic_ldmtvo.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945771/Science_Limcomm_rlrdqk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945770/Science_Legendary_az4uk8.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945769/Science_Fusion_eqyveq.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945768/Science_Epic_eeiydx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945767/Science_Common_tmtffc.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945766/Paleo_Ultra_Fusion_uyn37j.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945766/Paleo_Rare_susfzh.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945765/Paleo_Mythic_uzzuth.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945764/Paleo_Limrare_w35y0d.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945763/Paleo_Limleg_yilfub.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945762/Paleo_Limepic_dmf6sp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945762/Paleo_Limcomm_newl9l.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945761/Paleo_Legendary_hzipyg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945759/Paleo_Fusion_izguuy.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945759/Paleo_Epic_jxkkfr.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945758/Paleo_Common_yjxcxa.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945757/Oceans_Ultra_Fusion_oxyvde.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945755/Oceans_Rare_kqnkfo.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945755/Oceans_Mythic_whaaeu.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945754/Oceans_Limrare_fbb8cf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945754/Oceans_Limleg_zx7foj.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945752/Oceans_Limepic_ricndi.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945751/Oceans_Fusion_kxamoj.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945751/Oceans_Limcomm_fz1vlo.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945750/Oceans_Legendary_efk7ud.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945748/Oceans_Epic_udiqym.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945747/Oceans_Common_i7n1fa.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945746/Life_Rare_ery6vy.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945746/Life_Mythic_cycga6.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945745/Life_Limrare_mml9bw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945744/Life_Limleg_a2pfat.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945744/Life_Limepic_oohsiu.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945742/Life_Limcomm_jmxnzk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945741/Life_Legendary_vfbatu.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945741/Life_Fusion_xkb2dg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945739/Life_Epic_lqs7lx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945739/Life_Common_vv7np6.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945738/History_Rare_buz4gq.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945737/History_Mythic_zs8e0b.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945736/History_Limleg_ero3ks.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945736/History_Limrare_aswg2k.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945734/History_Limepic_ltgryt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945733/History_Common_tuqxnf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945733/History_Limcomm_fgbuoe.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945733/History_Legendary_nw24h5.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945732/History_Fusion_pahpxl.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945731/History_Epic_ymaesf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945728/Arts_Ultra_Fusion_ne8e1y.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945727/Arts_Rare_dxeni9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945726/Arts_Mythic_fuulpy.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945726/Arts_Limrare_tggrxv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945725/Arts_Limleg_n9sond.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945724/Arts_Limepic_npsxkc.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945723/Arts_Limcomm_xhwjdl.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945722/Arts_Legendary_qrwx5q.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945721/Arts_Fusion_werxqj.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945721/Arts_Epic_lzq4rw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726945719/Arts_Common_vgsrmq.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728858000/Space_Mythic_aktt8r.png']
}

// export const customCardIcons = () => {
//   return ['http://res.cloudinary.com/defal1ruq/image/upload/v1726540345/primate_t_oaburs.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540283/lifespec_t_znjmcw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540280/lcritter_t_srlohz.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540371/solarsystem_t_h3qm76.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540247/fabfish_t_pztzlv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540382/structure_t_k5ekud.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540255/funiverse_t_vmuz1m.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540267/histspec_t_uy8dn7.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540385/tree_t_sok3nn.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540358/scimyth_t_ts24n1.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540212/aztecmyth_t_yoo9um.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540295/monstdeep_t_pujbk9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540342/plant_t_u2w5i3.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540355/roman_t_uustra.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540316/philosopher_t_mvbpaf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540216/body_t_ebntuv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540229/crustacean_t_rrkyyg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540232/deepocean_t_lu26dg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540393/volcano_t_s5tc09.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540378/spacetech_t_vflg2q.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540313/paleofus_t_urlkfs.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540350/river_t_qqmlzh.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540221/cephalopod_t_t2vuou.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540272/iceage_t_zsdx9g.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540222/cfolklore_t_zizkkd.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540207/artmyth_t_d5s6m7.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540270/humanevo_t_faucmi.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540198/agreece_t_kjhoww.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540260/graphicdesign_t_dx1lk3.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540401/zodiac_t_sdansg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540259/gmyth_t_mzs6kg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540199/amfolk_t_cnjf71.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540344/play_t_ymrxcs.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540268/hoaxcon_t_bm6zk2.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540224/colors_t_i5j74c.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540306/oldwest_t_wwgg0n.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540219/carni_t_bebvsp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540386/tudors_t_bsycwa.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540367/secretsociety_t_weup2m.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540196/acreature_t_fdi65i.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540290/medicine_t_g1h3gi.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540248/fashions_t_t992e9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540279/landtime_t_asoapd.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540294/money_t_v4ge3l.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540318/pirate_t_lpjprf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540357/scifus_t_p1kfb8.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540241/element_t_pymqhf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540390/venom_t_snsvel.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540379/sport_t_ikszmt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540370/shark_t_gyifbk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540261/halloween_t_jtbe02.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540397/weird_t_nrb02f.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540257/gem_t_rf7zbp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540209/astronaut_t_wlurfl.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540393/warinno_t_kodvml.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540301/nebula_t_b5d513.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540287/marsupial_t_mjnwab.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540228/coolcat_t_dyc1k9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540281/lifefus_t_wgh6si.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540253/fnature_t_nipd2b.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540243/espionage_t_aewffo.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540352/robinhood_t_pm7og5.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540399/write_t_dv7qh9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540203/aroundreef_t_prgj6l.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540310/oreptile_t_fssdnx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540274/inginvention_t_bilevt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540230/cuisine_t_lzxjry.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540395/watchingtheskies_t_ujp8dl.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540234/discovery_t_b8j4nt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540283/lifemyth_t_ocv8vj.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540292/molluscswaterbugs_t_nkylee.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540263/herbi_t_ajz6w8.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540223/climate_t_qmxqvc.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540217/bug_t_o6tyds.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540252/flyer_t_n1bahf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540231/cutecat_t_qwuad2.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540278/jfolk_t_gbn6bo.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540381/stagescreen_t_nfjqcg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540286/mammal_t_pjk2y6.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540349/rite_t_cjhvn2.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540377/spacespec_t_xczmky.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540394/warmachine_t_r4sh4k.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540384/tarot_t_mtaaee.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540226/constellation_t_xdg9th.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540276/japan_t_xkugfp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540205/arthurian_t_ta4tav.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540389/undermicro_t_usqbu5.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540293/monarch_t_jfia7c.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540233/design_t_wgbaux.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540369/shakesystem_t_xfr0da.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540275/instrument_t_mbpfid.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540289/math_t_tmupll.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540311/painter_t_zpgiie.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540214/bird_t_ftuc1i.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540356/sbitb_t_taak9d.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540236/document_t_nfqplg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540353/rocket_t_ajd9rw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540347/reptile_t_ntoqgt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540319/planetside_t_la9pr8.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540363/seabird_t_i9dnpv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540242/energy_t_ub7hxx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540263/heartbreak_t_hc3bql.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540300/natmonument_t_u8ybt9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540240/egyptmyth_t_ib0txg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540348/ridingwaves_t_lu9yod.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540303/nmyth_t_mmgvot.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540304/occult_t_a7ornm.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540201/amphibian_t_pqimix.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540256/futurology_t_zrlqt1.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540213/battle_t_o3atff.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540399/wonder_t_sr4j6d.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540204/artfus_t_tyunbt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540315/paleospec_t_hnndry.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540237/dog_t_lkb2iw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540251/festivetradition_t_dkwzil.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540197/aegypt_t_ak1b6v.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540202/amrev_t_ng8pkx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540366/seaspec_t_dnj5es.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540361/scispec_t_qxr6ef.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540266/histmyth_t_r0fcum.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540297/musically_t_rfrjlt.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540299/mythcreatures_t_ucajpg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540219/butterfly_t_nuhgoo.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540309/omni_t_ejhipm.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540315/paleomyth_t_ac7rga.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540285/ltreasure_t_mvwvfs.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540363/seafus_t_o5vhgm.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540308/omammal_t_gujkob.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540271/hybrid_t_ze63tb.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540211/aviation_t_vdr9qn.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540374/spacemyth_t_mycfcj.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540376/spaceoddities_t_voa0yr.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540246/exploringstars_t_hbvi0c.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540373/spacefus_t_zklrfb.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540208/artspec_t_ctuv4h.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540365/seamyth_t_ffhlzr.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540238/dpevo_t_paddln.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540305/odyssey_t_oe2ppc.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540296/mountain_t_qekj9y.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540244/exploration_t_z5tzlm.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540388/underground_t_bfx32s.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540265/histfus_t_koco6u.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540250/feistyfish_t_vmaav6.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1726540360/scipioneer_t_p84uxv.png']
// }

export const customCardIcons = () => {
  return ['http://res.cloudinary.com/defal1ruq/image/upload/v1728859034/Amazing_Astronauts_kvsavw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859035/American_Folklore_fainmu.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859035/Amphibians_yrrznw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859035/Ancient_Creatures_wwlsxr.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859036/Ancient_Egypt_h7frke.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859036/Ancient_Greece_dvxqn0.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859037/Angela_Maxwell_s_kqkp9h.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859037/Around_the_Reef_mlbjbg.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859038/Arthurian_Legends_ajjwjf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859038/Arts_Culture_Fusions_czd6wb.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859039/Arts_Culture_Mythics_jonzba.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859039/Arts_Culture_Specials_tsnaug.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859040/Awesome_Aviation_naq5bk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859040/Aztec_Mythology_txe7rf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859041/Battle_ojwj2y.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859041/Beautiful_Butterflies_jk3wii.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859042/Birds_n0vqqb.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859042/Brilliant_Human_Body_igrnl5.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859043/Bugs_sgvqwr.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859043/Carnivores_c9dblz.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859044/Cephalopods_movzzq.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859045/Chinese_Folklore_iqm0sr.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859045/Climate_Change_nvggjv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859045/Colors_psb1ul.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859046/Constellations_j1nwrp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859046/Cool_Cats_gpngnk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859047/Crustaceans_kn79mv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859047/Curious_Cuisine_sex4h0.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859048/Cute_Cats_unjrxv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859048/Debunked_pjhl04.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859049/Deep_Ocean_wt3dtl.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859049/Dizzying_Discoveries_vtr6f4.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859050/Documented_lukd3o.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859050/Dogs_k7sqa0.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859051/Donald_Prothero_s_vjsrxa.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859051/Egyptian_Mythology_voupt9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859052/Energy_rizchb.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859052/Espionage_kajq8d.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859053/Excellent_Elements_oztmtq.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859053/Exciting_Exploration_hpdblj.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859054/Exploring_the_Stars_vgvrhv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859054/Fabulous_Fish_gm7jlq.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859055/Fancy_Fashions_lb35mu.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859055/Fearsome_Flyers_gbo6th.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859056/Fears_and_Phobias_xrteio.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859056/Feisty_Fish_g0gg13.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859057/Festive_Traditions_ynsimo.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859057/Feudal_Japan_i7kboe.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859058/Fiction_and_Fantasy_qyufya.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859058/Forces_of_Nature_mofmrp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859059/Forces_of_the_Universe_lr5ytc.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859059/Fruit_and_Veg_gdg0wv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859059/Funky_Fungi_x4jlxa.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859060/Futurology_shizo3.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859061/Going_Underground_paesqn.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859061/Good_Sports_kbzav9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859061/Gorgeous_Graphic_Design_chtnts.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859062/Grand_Designs_f9m29k.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859062/Greek_Mythology_qiylgr.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859063/Groundbreakers_gze1wz.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859063/Herbivores_p7flbr.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859064/Hidden_Gems_rfb2tj.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859064/History_Fusions_xb0m3m.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859065/History_Mythics_xlo4nb.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859065/History_of_Heartbreak_n1br2z.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859066/History_Specials_wimtus.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859066/History_of_the_Internet_pppi4n.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859067/Hoaxes_and_Cons_ttg1yc.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859068/Horrible_Halloween_hsnkkq.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859068/Human_Evolution_pyzofn.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859068/Hybrid_Animals_o3pvab.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859069/Ice_Age_jisgyz.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859069/Ingenious_Inventions_fqftcy.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859070/Innovations_of_War_jjniqz.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859070/Instrumental_zi2b7v.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859071/Japanese_Folklore_cdl4ir.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859071/Land_Before_Time_atkhqf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859072/Legends_of_the_Old_West_afajs9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859073/Life_on_Land_Fusions_ozfuep.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859073/Life_on_Land_Mythics_rmne1k.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859073/Life_on_Land_Specials_td4tao.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859074/Little_Critters_vzfmim.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859075/Lost_Treasures_mja2mv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859075/Machines_of_War_laeo58.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859075/Majestic_Mountains_i28ioo.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859076/Mammals_pcdydb.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859077/Marsupials_cjcchj.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859077/Marvellous_Medicine_o3gvb4.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859077/Mega_Math_k8xxyo.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859078/Molluscs_Worms_and_Water_Bugs_ecm3it.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859078/Money_Money_Money_to1v7y.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859079/Monsters_of_the_Deep_alcunx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859079/Moon_in_Motion_jxbcq8.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859080/Musically_Minded_gzammw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859080/Mythical_Creatures_chz64e.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859081/Natural_Monuments_ad5h64.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859082/Nebulae_u8nzm4.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859082/Norse_Mythology_pg1ii3.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859082/Ocean_Mammals_aemtaw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859114/Ocean_Reptiles_kgk1qs.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859115/Oceans_Seas_Fusions_bnu9iy.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859115/Oceans_Seas_Mythics_swaybf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859116/Oceans_Seas_Specials_dntrgw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859116/Omnivores_hy9mnf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859117/On_Track_q5helz.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859118/Once_Upon_a_Time_axx8gi.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859118/Paleontology_Fusions_govvix.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859119/Paleontology_Mythics_s415xk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859119/Paleontology_Specials_p5l7ep.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859120/Philosophy_guxyqy.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859121/Pioneers_of_Science_fhhwhh.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859121/Planetside_rmbkb3.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859122/Plant_Life_vyjwwl.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859123/Playtime_c2d38h.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859123/Plundering_Pirates_mpaspk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859124/Primates_jmdctx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859125/Prominent_Painters_gkgtjf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859125/Radical_Rockets_uxwvgz.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859125/Raging_Rivers_djbckz.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859126/Reptiles_gfmhte.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859126/Riding_the_Waves_gab6ha.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859127/Rites_and_Rituals_crppnl.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859128/Science_Fusions_p21tjp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859128/Science_Mythics_pkzunf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859129/Science_Specials_ppnjsk.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859130/Sea_Birds_qbljs9.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859130/Secret_Societies_a6wbod.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859131/Shake_Up_the_System_ffvzow.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859131/Sharks_nfqzno.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859132/Signs_of_the_Zodiac_xrz2z2.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859132/Space_Fusions_u10ohr.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859133/Space_Mythics_kifgls.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859134/Space_Oddities_adl3mx.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859134/Space_Specials_j4smed.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859135/Space_Technology_yixfln.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859135/Stage_and_Screen_w0hwtp.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859136/Sue_Black_s_l77b07.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859137/Super_Structures_ilmq6h.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859138/Tarot_iskhdl.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859138/The_American_Revolution_hzrkxm.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859138/The_Four_Horsemen_irez0b.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859140/The_Legend_of_Robin_Hood_hwzb14.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859140/The_Occult_ibf95u.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859141/The_Original_Odyssey_dybhyf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859141/The_Roman_Empire_jg0uy4.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859142/The_Solar_System_w3r6ma.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859143/The_Write_Stuff_lpmwy0.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859143/Tremendous_Trees_hrrtpl.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859144/Turbulent_Tudors_ggtxbz.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859144/Under_the_Microscope_njl15o.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859145/Unruly_Rulers_wlsq5t.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859146/Venomous_Creatures_jeezmz.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859146/Vicious_Vikings_phjapf.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859147/Volcanoes_k4ueca.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859148/Watching_the_Skies_c2z0db.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859149/Weapons_of_Choice_msuuum.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859149/Weird_World_pbjcrv.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859150/West_African_Folklore_wotlyw.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859150/Wonders_of_Construction_m0jntq.png', 'http://res.cloudinary.com/defal1ruq/image/upload/v1728859151/World_of_Words_ehq7j4.png']
}

export const cardEditIcons = () => {
  // return ['https://res.cloudinary.com/defal1ruq/image/upload/v1728940001/draw_onlg1u.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940005/turnstart_njtwir.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940003/play_bqxcpx.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940004/return_bd2v6x.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940003/power_piybpa.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940001/energy_odcsrq.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940003/ppt_nxt2vj.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940002/ept_pbosqp.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940002/lock_zyhr1k.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940001/burn_hsnzz0.png']
  return ['https://res.cloudinary.com/defal1ruq/image/upload/v1728940003/power_piybpa.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940001/energy_odcsrq.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940003/ppt_nxt2vj.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940002/ept_pbosqp.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940002/lock_zyhr1k.png', 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940001/burn_hsnzz0.png']
}