<template>
  <q-card>
    <q-toolbar>
      <q-toolbar-title> </q-toolbar-title>
      <q-btn flat round icon="las la-print" @click="printHtml(content)" />
    </q-toolbar>
    <div class="full-width">
      <!-- {{ value }} -->
      <div v-html="content"></div>
    </div>
  </q-card>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  computed: {
    content() {
      let model = this.value;
      let nullable = this.nullable;
      if (
        !model ||
        model === null ||
        !model.patient ||
        model.patient === null
      ) {
        return `<div>Please wait or reopen this dialog</div>`;
      }

      let header = ` <html lang="en" xmlns="https://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width,initial-scale=1">
                    <meta name="x-apple-disable-message-reformatting">
                    <title></title>
                    <!--[if mso]>
                    <style>
                        table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
                        div, td {padding:0;}
                        div {margin:0 !important;}
                    </style>
                    <noscript>
                        <xml>
                            <o:OfficeDocumentSettings>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                            </o:OfficeDocumentSettings>
                        </xml>
                    </noscript>
                    <![endif]-->
                    <style>
                        table, td, div, h1, p {
                            font-family: Arial, sans-serif;
                        }

                        h1 {
                        box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';color:#3d4852;font-size:18px;font-weight:bold;margin-top:0;text-align:left;
                        text-align:center;
                        line-height: inherit;
                        }
                        p {
                            box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left;
                        }
                        table td {
                            vertical-align: baseline;
                        }
                        a.button {
                            box-sizing: border-box;
                            font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
                            border-radius: 4px;
                            color: #fff;
                            display: inline-block;
                            overflow: hidden;
                            text-decoration: none;
                            background-color: #2d3748;
                            border-bottom: 8px solid #2d3748;
                            border-left: 18px solid #2d3748;
                            border-right: 18px solid #2d3748;
                            border-top: 8px solid #2d3748;
                            height:35px;
                        }
                        a.button-negative {
                            box-sizing: border-box;
                            font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
                            border-radius: 4px;
                            color: #fff;
                            display: inline-block;
                            overflow: hidden;
                            text-decoration: none;
                            background-color: #ad5353;
                            border-bottom: 8px solid #ad5353;
                            border-left: 18px solid #ad5353;
                            border-right: 18px solid #ad5353;
                            border-top: 8px solid #ad5353;
                            height:35px;
                        }
                    </style>
                </head>
                <body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;">
                    <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;">
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';background-color:#edf2f7;margin:0;padding:0;width:100%;">
                <tbody><tr>
                <td align="center" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';margin:0;padding:0;width:100%;">
                <tbody>
               
               


                <tr>
                <td width="100%" cellpadding="0" cellspacing="0" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';background-color:#edf2f7;border-bottom:1px solid #edf2f7;border-top:1px solid #edf2f7;margin:0;padding:0;width:100%">
                <table class="m_-5150047522908438776inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';background-color:#ffffff;border-color:#e8e5ef;border-radius:2px;border-width:1px;margin:0 auto;padding:0;width:570px;max-width: 130vw;">

                <tbody><tr>
                <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';max-width:100vw;padding:32px">`;

      let footer1 = `
           <p>Regards,<br>
                        Xing Pet Care &amp; Clinic</p>
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';border-top:1px solid #e8e5ef;margin-top:25px;padding-top:25px">
                        <tbody><tr>
                        <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
                        <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';line-height:1.5em;margin-top:0;text-align:left;font-size:14px">
                        Immediate contacts:
                        </p><table>
                        <tbody>
                            <tr>
                                <td>Whatsapp</td>
                                <td>:</td>
                                <td><a href="https://wa.me/6285782481186" style="text-decoration: none; color: #3d6db3">085782481186</a></td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>:</td>
                                <td><a href="mailto://xingpet@gmail.com" style="text-decoration: none;color: #3d6db3;">
                                    xingpet@gmail.com
                                </td>
                            </tr>
                        </tbody></table>
                        <p></p>

        `;

      let footer2 = `
        </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>

                            <tr>
                            <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">

                            </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>
                            </tbody></table>
                                </div>

                            </body></html>
        `;
      let body = `
          <p style="text-align:right">${this.$util.toDateString(
            model.createdAt
          )}</p>
          <h1>${model.title}</h1>
          <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left">
                    Saya yang bertanda tangan dibawah ini, pemilik/ yang diberi kuasa oleh pemilik : <br>
                    <table style="width:100%">
                    <tr>
                        <td>Nama</td>
                        <td>:</td>
                        <td>${model.nama}</td>
                    </tr>
                    <tr>
                        <td>NIK</td>
                        <td>:</td>
                        <td>${nullable(model.nik)}</td>
                    </tr>
                    <tr>
                        <td>No HP</td>
                        <td>:</td>
                        <td>${nullable(model.hp)}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>:</td>
                        <td>${nullable(model.email)}</td>
                    </tr>
                    <tr>
                        <td>Alamat</td>
                        <td>:</td>
                        <td>${nullable(model.alamat)?.replaceAll(
                          "\n",
                          "<br>"
                        )}</td>
                    </tr>
                    </table>
                </p>
                <p>
                Menyatakan bahwa atas permintaan saya secara sadar dan tanpa paksaan dari pihak manapun 
                untuk meminta pihak dokter hewan xing pet care and clinic melaksanakan prosedur euthanasia 
                terhadap ${model.animalType} saya yang bernama ${
        model.patientName
      }, yang berusia ${model.patient.age}. 
                Adapun alasan saya untuk meminta prosedur tersebut adalah karena: <br>
                <span style=""font-weight:bold;"">${nullable(
                  model.alasan
                )?.replaceAll("\n", "<br>")}</span>.
            </p>
            <p>
                Adapun dikemudian hari, saya tidak akan menuntut pihak dokter hewan ataupun 
                pihak management xing pet care and clinic atas keputusan yang sudah saya ambil. 
                Saya menerima resiko serta tanggung jawab sepenuhnya atas biaya untuk prosedur ini
            </p>
        `;
      return header + body + footer1 + footer2;
    }
  },
  watch: {
    // value(val) {
    //   this.model = JSON.parse(JSON.stringify(val));
    // }
  },
  methods: {}
};
</script>
