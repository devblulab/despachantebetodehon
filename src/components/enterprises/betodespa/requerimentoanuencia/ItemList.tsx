import React, { useEffect, useState } from 'react';
import { Typography, Button, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { collection, getFirestore, getDocs, onSnapshot } from 'firebase/firestore';

import { app } from '@/logic/firebase/config/app';
import jsPDF from 'jspdf';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import html2canvas from 'html2canvas';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const db = getFirestore(app);
const storage = getStorage(app);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    margin: 'auto',
    maxWidth: '1077px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ccc',
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.6,
    '@media print': {
      boxShadow: 'none',
      margin: '0',
      padding: '10px',
      width: '100%',
      fontSize: '20pt',
      boxSizing: 'border-box',
      pageBreakBefore: 'auto',
    },
  },
  noPrint: {
    '@media print': {
      display: 'none !important',
    },
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    fontSize: '1.0rem',
    fontWeight: 'bold',
  },
  title: {
    fontSize: '1.9rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: theme.spacing(5),
    
  },
  title2: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: theme.spacing(7),
    margin: theme.spacing(7),
    
    
  },
  title3: {
    fontSize: '2.2rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: theme.spacing(7),
    margin: theme.spacing(7),
    
    
  },
  subtitle: {
    fontSize: '0.8rem',
    marginTop: theme.spacing(1),
    fontWeight: 'bold',
    
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    background: 'rgba(124, 124, 124, 0.58)',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    borderBottom: '2px solid #000',
    paddingBottom: theme.spacing(1),
    
  },
  sectionTitle3: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(2),
    borderBottom: '1px solid #ccc',
    paddingBottom: theme.spacing(0),
  },
  sectionTitle4: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
    borderBottom: '1px solid #ccc',
    paddingBottom: theme.spacing(0),
  },
  field: {
    fontSize: '1.1rem',
    marginBottom: theme.spacing(4),
    paddingLeft: '10px',
    background: 'rgba(201, 201, 201, 0.58)',
    marginTop: theme.spacing(5),
  },
  field3: {
    fontSize: '0.7rem',
    marginBottom: theme.spacing(1),
  },
  field2: {
    fontSize: '1.3rem',
    marginBottom: theme.spacing(5),
  },
  signatureSection: {
    marginTop: theme.spacing(36),
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
  },
  signatureBlock: {
    textAlign: 'center',
    width: 'auto',
    borderTop: '2px solid #000',
    paddingTop: theme.spacing(0),
    margin: '0 auto',
  },
  searchField: {
    marginBottom: theme.spacing(1),
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
  },
  downloadButton: {
    marginTop: theme.spacing(1),
    backgroundColor: '#4CAF50',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#45a049',
    },
  },
}));

interface Item {
  id:string,
  cliente: string,
  
  status: string,
  quantidade: number;
  imagemUrls: string[],
  concluido: false,


  placa: string,
  renavam: string,
  crv: string,
  chassi:string,
  modelo:string,


  valordevenda:  string;
 bairroempresa: string,
  
 cargo:string,
  nomevendedor: string,
  cpfvendedor: string,
  enderecovendedor: string,
  complementovendedor: string,
  municipiovendedor: string,
  emailvendedor: string,
  dataCriacao: string | Timestamp;
  nomeempresa: string,
  cpfempresa: string,
  enderecoempresa: string,
  complementoempresa: string,
  municipioempresa: string,
  emailempresa: string,
 celtelempresa: string,
 cepvendedor: string;
  cepempresa: string;
  tipo: string;
  cnpjempresa: string;
 

  celtelvendedor: string,
  signature?: string; 

}
interface ItemListProps {
  items: Item[];
}

const CatalagoList: React.FC<ItemListProps> = () => {
  const classes = useStyles();
  const [items, setItems] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const defaultItem: Item = {
    id: '',
    cliente: '',
    status: '',
    quantidade: 0,
    imagemUrls: [],
    concluido: false,
    placa: '',
    renavam: '',
    crv: '',
    chassi: '',
    modelo: '',
    valordevenda: '',
    bairroempresa: '',
    cargo: '',
    nomevendedor: '',
    cpfvendedor: '',
    enderecovendedor: '',
    complementovendedor: '',
    municipiovendedor: '',
    emailvendedor: '',
    dataCriacao: '',
    nomeempresa: '',
    cpfempresa: '',
    enderecoempresa: '',
    complementoempresa: '',
    municipioempresa: '',
    emailempresa: '',
    celtelempresa: '',
    cepvendedor: '',
    cepempresa: '',
    tipo: '',
    cnpjempresa: '',
    celtelvendedor: '',
    signature: ''
  };

  useEffect(() => {
    const itemsCollectionRef = collection(db, 'Betodespachanteanuencia');
    
    const unsubscribe = onSnapshot(itemsCollectionRef, (querySnapshot) => {
      const fetchedItems: Item[] = [];
      querySnapshot.forEach((doc) => {
        fetchedItems.push({ id: doc.id, ...doc.data() } as Item);
      });
      setItems(fetchedItems);
    });

    return () => unsubscribe();
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredItems = searchText.length >= 4
    ? items.filter((item) => {
        const searchLower = searchText.toLowerCase();
        return (
          item.nomevendedor?.toLowerCase().includes(searchLower) ||
          (item.nomeempresa?.toLowerCase().includes(searchLower)) ||
          (item.id?.toLowerCase().includes(searchLower)) ||
          (item.renavam?.toLowerCase().includes(searchLower)
         ) );
      })
    : [];

  const currentItem = filteredItems.length > 0 ? filteredItems[0] : defaultItem;

  const formatDate = (date: string | Timestamp | undefined | null) => {
    if (!date) return 'Data inválida';

    let localDate;

    if (date instanceof Timestamp) {
      localDate = date.toDate();
    } else {
      localDate = new Date(date);
    }

    if (isNaN(localDate.getTime())) return 'Data inválida';

    const offsetMs = localDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(localDate.getTime() - offsetMs - 3 * 3600000);

    return format(adjustedDate, 'dd/MM/yyyy');
  };

  const handlePrint = () => {
    window.print();
  };

  const sendWhatsApp = async (pdfURL: string) => { 
    const telefone = '5548988449379';
    const mensagemWhatsApp = `Olá! Seu documento foi gerado e está pronto. Você pode baixá-lo aqui: ${pdfURL}`;
    const linkWhatsApp = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagemWhatsApp)}`;
    window.open(linkWhatsApp, '_blank');
  };

  const generatePDF = async () => {
    const input = document.getElementById('pdf-content');
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    const pdfBlob = pdf.output('blob');
    const storageRef = ref(storage, `pdfs/documento_${Date.now()}.pdf`);
    await uploadBytes(storageRef, pdfBlob);
    const pdfURL = await getDownloadURL(storageRef);
    
    pdf.save(`Requerimento_${currentItem.id || 'documento'}.pdf`);
    await sendWhatsApp(pdfURL);
  };
  
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        @page {
          size: A4;
          margin: 20mm 10mm;
        }
  
        body {
          margin: 0;
          padding: 0;
        }
  
        .printContent {
          visibility: visible;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: auto;
          min-height: 100vh;
          background: white !important;
        }
        
        .printContent * {
          visibility: visible;
        }
  
        .noPrint {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div>
      <div className={classes.noPrint} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <TextField
          label="Buscar por PLACA RENAVAM VENDEDOR empresa"
          value={searchText}
          onChange={handleSearchInputChange}
          variant="outlined"
          margin="normal"
          className={classes.searchField}
          InputProps={{
            style: {
              backgroundColor: 'white',
            },
          }}
          style={{ width: '50%' }}
        />
      </div>

      {searchText && (
        <Paper className={classes.paper}>
          <div id="pdf-content">
            <div className={classes.header}>
              <Typography className={classes.title}>Detran</Typography>
              <Typography className={classes.subtitle}>Departamento Estadual de Trânsito</Typography>
            </div>
            
            <Typography className={classes.title3} style={{ textAlign: 'center' }}>
              Termo de Anuência – Baixa Permanente de Veículo
            </Typography>
            
            <Typography className={classes.field2} style={{ marginTop: '20px' }}>
              A <strong>empresa</strong>, {currentItem.nomeempresa}, inscrita no CNPJ sob o nº, {currentItem.cnpjempresa}, com sede localizada cep: 
               {currentItem.cepempresa} 
              , {currentItem.enderecoempresa}
              , {currentItem.bairroempresa}
              , {currentItem.municipioempresa}
              , {currentItem.complementoempresa}, vem por meio deste, declarar que está ciente e anuente com a solicitação de baixa permanente do veículo de sua propriedade, conforme dados abaixo:
              <Typography className={classes.field}><strong>Placa:</strong> {currentItem.id}</Typography>
              <Typography className={classes.field}><strong>Renavam:</strong> {currentItem.renavam}</Typography>
              <Typography className={classes.field}><strong>Chassi:</strong> {currentItem.chassi}</Typography>
            </Typography>
            
            <Typography className={classes.field2} style={{ marginTop: '20px' }}>
              A empresa declara ainda que a baixa do referido veículo será realizada conforme as normas e procedimentos vigentes estabelecidos pelo DETRAN/SC, 
              estando ciente de que, uma vez efetuada a baixa permanente, o veículo não poderá retornar à circulação.
            </Typography>
            
            <strong>Nestes termos, pede deferimento.</strong>
            <br /><strong>Município:</strong> {currentItem.municipioempresa} em {formatDate(currentItem.dataCriacao)}, para a <strong>Empresa</strong> conforme indicado acima.
            
            {currentItem.signature && (
              <div className={classes.signatureSection}>
                <img src={currentItem.signature} alt="Assinatura do Cliente" style={{ maxWidth: '300px' }} />
              </div>
            )}
            
            <div className={classes.signatureSection}>
              <div className={classes.signatureBlock}>
                Assinatura do Vendedor ou Responsável
              </div>
            </div>
            
            <Typography className={classes.sectionTitle4}>b3certificacao@gmail.com</Typography>
          </div>

          <Button 
            onClick={() => {
              if (filteredItems.length > 0) {
                const item = filteredItems[0];
                const telefone = '5548988449379';
                const mensagem = `Olá. Preenchi a Intenção de Venda e a placa é ${item.id}.`;
                const linkWhatsApp = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;
                window.open(linkWhatsApp, '_blank');
              }
            }}
            variant="contained"
            size="large"
            className={`${classes.downloadButton} ${classes.noPrint}`}
          >
            Enviar Despachante
          </Button>
          
          <Button
            onClick={() => {
              if (filteredItems.length > 0) {
                const item = filteredItems[0];
                const telefone = '5548988749403';
                const mensagem = `Olá. Preenchi a Intenção de Venda e a placa é ${item.id}.`;
                const linkWhatsApp = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;
                window.open(linkWhatsApp, '_blank');
              }
            }}
            variant="contained"
            size="large"
            className={`${classes.downloadButton} ${classes.noPrint}`}
          >
            Enviar Digital
          </Button>
        </Paper>
      )}
    </div>
  );
};

export default CatalagoList;